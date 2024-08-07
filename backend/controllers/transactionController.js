const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Reservation = require("../models/reservationSchema");
const Invoice = require("../models/foodInvoiceSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const Transaction = require("../models/transactionSchema");
exports.getAllTransactions = catchAsyncErrors(async (req, res, next) => {
  const branch_id = req.query.branch_id;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const query = {};
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 404));
  }
  query.branch_id = req.query.branch_id;
  const transactions = await Transaction.find({ branch_id })
    .skip(startIndex)
    .limit(limit).populate('status');

  const count = await Transaction.countDocuments(query);
  const total_pages = count < limit ? 1 : Math.ceil(count / limit);

  res.status(200).json({
    message: "Operation Successfull",
    result: {
      items: transactions,
      meta: {
        total_items: count,
        item_count: transactions.length,
        items_per_page: limit,
        current_page: page,
        total_pages,
      },
    },
  });
});

exports.createTransaction = catchAsyncErrors(async (data) => {
  const transaction = await Transaction.create(data);
  return transaction;
});
