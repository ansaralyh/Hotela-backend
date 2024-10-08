const FoodInvoice = require("../models/foodInvoiceSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const { lookupIds } = require("../utils/lookupIds");
const { createTransaction } = require("./transactionController");

exports.createFoodInvoice = catchAsyncErrors(async (req, res, next) => {
  const { name, items, branch_id } = req.body;
  if (!name || !items?.length > 0 || !branch_id) {
    return next(new ErrorHandler("Fields Missing", 404));
  }
  const total_amount = items
    .map((item) => item.total_amount)
    .reduce((first, second) => Number(first) + Number(second), 0);
  await FoodInvoice.create({
    name,
    items,
    total_amount,
    hotel_id: req.user.hotel_id,
    branch_id,
  });
  createTransaction({
    hotel_id: req.user.hotel_id,
    branch_id,
    amount: total_amount,
    description: "Restaurant Invoice",
    status: lookupIds.TRANSACTION_STATUS_CREDIT,
  });
  res.status(200).json({
    message: "Operation Successfull",
    result: [],
  });
});

exports.getAllFoodInvoices = catchAsyncErrors(async (req, res, next) => {
  const branch_id = req.query.branch_id;
  const page = req.query.page || 1;
  const limit = req.query.limit || 10;
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 404));
  }
  const foodInvoices = await FoodInvoice.find({ branch_id }).populate(
    "items.item_id"
  );
  const count = await FoodInvoice.countDocuments({ branch_id });
  const total_pages = count < limit ? 1 : Math.ceil(count / limit);
  res.status(200).json({
    message: "Operational successfull",
    result: {
      items: foodInvoices,
      meta: {
        total_items: count,
        item_count: foodInvoices.length,
        items_per_page: limit,
        current_page: page,
        total_pages,
      },
    },
  });
});

exports.getSingleFoodInvoice = catchAsyncErrors(async (req, res, next) => {
  const id = req.params.id;

  if (!id) {
    return next(new ErrorHandler("Please provide invoice id", 404));
  }
  const foodInvoice = await FoodInvoice.findById(id).populate("items.item_id");
  res.status(200).json({
    message: "Operation successfull",
    result: foodInvoice,
  });
});
