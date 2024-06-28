

const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Expenses = require("../models/expenseSchema");
const { uploadFile } = require("../utils/uploadFiles");
const path = require("path");
const fs = require("fs");

exports.store = catchAsyncErrors(async (req, res, next) => {
    const { hotel_id, branch_id, expense_category } = req.body;
    const { receipt } = req.files || {};

    const uploadFolderPath = path.join(__dirname, "../uploads/receipts");

    let receiptUrl = null;
    if (receipt) {
        if (Array.isArray(receipt)) {
            return next(new ErrorHandler("Only one receipt image is allowed", 400));
        }

        if (!fs.existsSync(uploadFolderPath)) {
            fs.mkdirSync(uploadFolderPath, { recursive: true });
        }

        const fileName = receipt.name;
        const receiptPath = path.join(uploadFolderPath, fileName);
        await receipt.mv(receiptPath);
        receiptUrl = `${req.protocol}://${req.get("host")}/uploads/receipts/${fileName}`;
    }

    const expensesData = {
        hotel_id,
        branch_id,
        expense_category,
    };

    if (receiptUrl) {
        expensesData.receipt = receiptUrl;
    }

    const expenses = await Expenses.create(expensesData);

    res.status(200).json({
        success: true,
        expenses,
    });
});

exports.get = catchAsyncErrors(async (req, res, next) => {
    const expenseId = req.params.id;
    const expenses = await Expenses.findById(expenseId);
    if (!expenses) {
        return next(new ErrorHandler("No expenses found with this id", 404));
    }

    res.status(200).json({
        message: 'Operation successfull',
        result: expenses

    })

});

exports.index = catchAsyncErrors(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const branch_id = req.query.branch_id;
    if (!branch_id) {
        return next(new ErrorHandler("Please provide branch id", 400));
    }
    const startIndex = (page - 1) * limit;
    const expenses = await Expenses.find({ branch_id }).skip(startIndex).limit(limit);
    res.status(200).json({
        message: "expenses retrieved successfully",
        result: expenses,
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
