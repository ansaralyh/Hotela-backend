const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Expenses = require("../models/expenseSchema");
const { uploadFile } = require("../utils/uploadFiles");
const path = require("path");
const fs = require("fs");
const Branch = require("../models/branchSchema");
const { createTransaction } = require("./transactionController");
const { lookupIds } = require("../utils/lookupIds");
exports.store = catchAsyncErrors(async (req, res, next) => {
  const { branch_id, category, cost, name,vendor_name } = req.body;
  // const { receipt } = req.files || {};

  // const uploadFolderPath = path.join(__dirname, "../uploads/receipts");

  // let receiptUrl = null;
  // if (receipt) {
  //   if (Array.isArray(receipt)) {
  //     return next(new ErrorHandler("Only one receipt image is allowed", 400));
  //   }

  //   if (!fs.existsSync(uploadFolderPath)) {
  //     fs.mkdirSync(uploadFolderPath, { recursive: true });
  //   }
  //   const fileName = receipt.name;
  //   const receiptPath = path.join(uploadFolderPath, fileName);
  //   await receipt.mv(receiptPath);
  //   receiptUrl = `${req.protocol}://${req.get(
  //     "host"
  //   )}/uploads/receipts/${fileName}`;
  // }

  const expensesData = {
    hotel_id: req.user.hotel_id,
    branch_id,
    category,
    cost,
    name,
    vendor_name
  };

  // if (receiptUrl) {
  //   expensesData.receipt = receiptUrl;
  // }

  await Expenses.create(expensesData);
  createTransaction({
    hotel_id: req.user.hotel_id,
    branch_id,
    amount: cost,
    description: "Expense",
    status: lookupIds.TRANSACTION_STATUS_DEBIT,
  });
  const branch = await Branch.findById(branch_id);
  branch.petty_cash = branch.petty_cash - Number(cost);
  await branch.save();

  res.status(200).json({
    success: true,
    result: branch,
  });
});

exports.get = catchAsyncErrors(async (req, res, next) => {
  const expenseId = req.params.id;
  const expenses = await Expenses.findById(expenseId);
  if (!expenses) {
    return next(new ErrorHandler("No expenses found with this id", 404));
  }

  res.status(200).json({
    message: "Operation successfull",
    result: expenses,
  });
});

exports.index = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const branch_id = req.query.branch_id;
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 400));
  }
  const startIndex = (page - 1) * limit;
  const expenses = await Expenses.find({ branch_id })
    .skip(startIndex)
    .limit(limit)
    .populate("branch_id")
    .populate("hotel_id")
    .populate("category");

  const count = await Expenses.countDocuments({ branch_id });
  const total_pages = count < limit ? 1 : Math.ceil(count / limit);
  res.status(200).json({
    message: "expenses retrieved successfully",
    result: {
      items: expenses,
      meta: {
        total_items: count,
        item_count: expenses.length,
        items_per_page: limit,
        current_page: page,
        total_pages,
      },
    },
  });
});

exports.update = catchAsyncErrors(async (req, res, next) => {
  let expenses = await Expenses.findById(req.params.id);
  if (!expenses) {
    return next(new ErrorHandler("Item not found", 404));
  }
  expenses = await Expenses.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    message: "expenses updated successfully",
    result: expenses,
  });
});

exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const expenses = await Expenses.findByIdAndDelete(req.params.id);

  res.status(200).json({
    message: "expenses deleted successfully",
  });
});
