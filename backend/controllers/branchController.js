const Branch = require("../models/branchSchema");
const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const fs = require("fs");
const { uploadFile } = require("../utils/uploadFiles");
const path = require("path");
const Reservation = require("../models/reservationSchema");
const FoodInvoice = require("../models/foodInvoiceSchema");
const Expense = require("../models/expenseSchema");
const Room = require("../models/roomModel");
exports.store = catchAsyncErrors(async (req, res, next) => {
  const { name, location, description } = req.body;

  const { image } = req.files;
  const uploadFolderPath = path.join(__dirname, "../uploads/branch_image");
  if (image) {
    if (!fs.existsSync(uploadFolderPath)) {
      fs.mkdirSync(uploadFolderPath, { recursive: true });
    }
    const fileName = image.name;
    const imagePath = path.join(uploadFolderPath, fileName);
    await image.mv(imagePath);
    const imageUrl = `${req.protocol}://${req.get("host")}/${fileName}`;
    req.body.image = imageUrl;
  }
  if (!name || !location || !image || !description) {
    return next(new ErrorHandler("Fields missing", 400));
  }

  const newBranch = await Branch.create({
    name,
    location,
    description,
    image: req.body.image,
    hotel_id: req.user.hotel_id,
  });

  res.status(201).json({
    message: "Branch created successfully",
    result: newBranch,
  });
});

/**Get single Branch */
exports.get = catchAsyncErrors(async (req, res, next) => {
  // console.log('Here')
  const branch_id = req.params.id;
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id"));
  }
  const singleBranch = await Branch.findById(branch_id);

  if (!singleBranch) {
    return next(new ErrorHandler("Branch not found", 404));
  }
  res.status(200).json({
    success: true,
    result: singleBranch,
  });
});

/**Get all branches */
exports.index = catchAsyncErrors(async (req, res, next) => {
  const allBranches = await Branch.find();
  if (!allBranches) {
    return next(new ErrorHandler("Branches not found", 404));
  }
  res.status(200).json({
    messege: "Operation successfulll",
    result: allBranches,
  });
});

/**Update a Branch */

exports.update = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.params.id;
  const updateData = req.body;
  const updatedBranch = await Branch.findByIdAndUpdate(branchId, updateData, {
    new: true,
    runValidators: true,
  });

  if (!updatedBranch) {
    return res.status(404).json({
      success: false,
      message: "branch not found",
    });
  }

  res.status(200).json({
    success: true,
    updatedBranch,
  });
});

/**Delete a branch */
exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const removeBranch = await Branch.findById(req.params.id);
  if (!removeBranch) {
    return next(new ErrorHandler("branch not found", 404));
  }
  await Branch.findByIdAndDelete(req.params.id);
  res.status(200).json({
    success: true,
    message: "branch deleted successfully!",
  });
});

exports.addPettyCash = catchAsyncErrors(async (req, res, next) => {
  const branchId = req.query.branch_id;
  const { amount } = req.body;

  const branch = await Branch.findById(branchId);
  if (!branch) {
    return next(new ErrorHandler("Branch not found", 404));
  }

  branch.petty_cash += Number(amount);
  await branch.save();

  res.status(200).json({
    status: true,
    result: "Petty cash added successfully",
  });
});

exports.getDashboardData = catchAsyncErrors(async (req, res, next) => {
  const branch_id = req.query.branch_id;
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id"));
  }

  const reservations = await Reservation.find({ branch_id });
  const foodInvoices = await FoodInvoice.find({ branch_id });
  const reservation_total = reservations
    .map((reservation) => reservation.invoice.total_amount)
    .reduce((first, second) => first + second, 0);
  const food_invoices = foodInvoices
    .map((item) => item.total_amount)
    .reduce((first, second) => first + second, 0);

  const total = reservation_total + food_invoices;

  const expenses = await Expense.find({ branch_id });
  const total_expenses = expenses
    .map((item) => item.cost)
    .reduce((first, second) => first + second, 0);
  const branch = await Branch.findById(branch_id);
  const total_rooms = await Room.countDocuments({ branch_id });
  const total_bookings = await Reservation.countDocuments({ branch_id });

  // Calculating upcomming reservations
  let today = new Date();
  today.setHours(0, 0, 0, 0);
  let dayAfterToday = new Date(today);
  dayAfterToday.setDate(today.getDate() + 1);
  const upcomingReservations = await Reservation.find({
    branch_id,
    checkInDate: { $gte: dayAfterToday },
  }).populate('customer_id');

  const { year } = req.query;
    let startDate, endDate;

    if (year) {
      // If year is provided, fetch data for that year
      startDate = new Date(`${year}-01-01T00:00:00.000Z`);
      endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);
    } else {
      // If no year is provided, fetch data for the previous 12 months
      endDate = new Date();
      startDate = new Date();
      startDate.setFullYear(endDate.getFullYear() - 1);
    }

    const monthsInString = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    // Fetch reservations grouped by month
    const monthly_reservations = await Reservation.aggregate([
      {
        $match: {
          checkInDate: { $gte: startDate, $lt: endDate }
        }
      },
      {
        $group: {
          _id: {
            year: { $year: "$checkInDate" },
            month: { $month: "$checkInDate" }
          },
          reservations: { $sum: 1 }
        }
      },
      {
        $sort: { "_id.year": 1, "_id.month": 1 }
      },
      {
        $project: {
          _id: 0,
          month: { $subtract: ["$_id.month", 1] },
          reservations: 1
        }
      }
    ]);

    // Initialize all months with 0 reservations
    const monthlyReservations = monthsInString.map((month, index) => ({
      name: month,
      reservations: 0
    }));

    // Update with actual reservation data
    monthly_reservations.forEach(reservation => {
      monthlyReservations[reservation.month].reservations = reservation.reservations;
    });

    const createdAt = branch.createdAt;
    const currentYear = new Date().getFullYear();
    const createdYear = createdAt.getFullYear();
    const years = [];

    for (let year = createdYear; year <= currentYear; year++) {
      years.push(year);
    }

  const total_profit = total - total_expenses;
  res.status(200).json({
    message: "Operation Successfull",
    result: {
      total_profit,
      total_expenses,
      available_amount: branch.petty_cash,
      total_rooms,
      total_bookings,
      upcomming_reservations: upcomingReservations,
      monthly_reservations: monthlyReservations,
      years
    },
  });
});
