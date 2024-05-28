const ErrorHandler = require("../utils/ErrorHandler");
const Reservations = require("../models/reservationSchema");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Invoice = require("../models/invoiceSchema");
const Room = require("../models/roomModel");
const { calculateDaysBetweenCheckInOut } = require("../utils/dates");
const Rooms = require("../models/roomModel");
const Customer = require("../models/customerScehma");
const customer = require("../models/customerScehma");

exports.store = catchAsyncErrors(async (req, res, next) => {
  const {
    checkInDate,
    checkOutDate,
    room_id,
    branch_id,
    cnic,
    numOfPeople,
    name,
    contact,
    currentAddress,
    permanentAddress,
    email,
    gender,
    maritalStatus,
    city,
    extraMetressCharges,
  } = req.body;

  if (
    !checkInDate ||
    !checkOutDate ||
    !room_id ||
    !branch_id ||
    !cnic ||
    !numOfPeople ||
    !name ||
    !contact ||
    !currentAddress ||
    !permanentAddress ||
    !email ||
    !gender ||
    !maritalStatus ||
    !city
  ) {
    return next(new ErrorHandler("Fields missing", 400));
  }

  const existingReservation = await Reservations.findOne({
    room_id: room_id,
    $or: [
      {
        checkInDate: { $lt: checkOutDate },
        checkOutDate: { $gt: checkInDate },
      },
      { checkInDate: { $gte: checkInDate, $lt: checkOutDate } },
      { checkOutDate: { $gt: checkInDate, $lte: checkOutDate } },
    ],
  });

  if (existingReservation) {
    return next(
      new ErrorHandler("Room is already reserved for the selected dates", 400)
    );
  } else {
    const existingCustomer = await customer.findOne({ cnic });
    if (existingCustomer) {
      const reservation = await Reservations.create({
        customer_id: existingCustomer._id,
        checkInDate,
        checkOutDate,
        room_id,
        branch_id,
        numOfPeople,
        extraMetressCharges,
        hotel_id: req.user.id,
      });

      res.status(200).json({
        message: "Operation successful",
        result: reservation,
      });
    } else {
      const customer = await Customer.create({
        name,
        cnic,
        email,
        permanentAddress,
        currentAddress,
        contact,
        gender,
        maritalStatus,
        city,
        numOfPeople,
        extraMetressCharges,
        branch_id,
        hotel_id: req.user.hotel_id,
      });
      const reservation = await Reservations.create({
        customer_id: customer._id,
        checkInDate,
        checkOutDate,
        room_id,
        branch_id,
        numOfPeople,
        extraMetressCharges,
        hotel_id: req.user.id,
      });

      res.status(200).json({
        message: "Operation successful",
        result: reservation,
      });
    }
  }

  // const days = calculateDaysBetweenCheckInOut(checkInDate, checkOutDate);
  // const room = await Room.findById(room_id).populate("room_category");
  // const amount = parseInt(days) * parseInt(room.room_category.cost);
  // const invoice = await Invoice.create({
  //     customer_id,
  //     reservation_id: reservation._id,
  //     hotel_id: req.user.id,
  //     branch_id,
  //     total_amount: amount,
  // });
});

exports.index = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const query = {};
  query.branch_id = req.query.branch_id;
  if (req.query.checkInDate && req.query.checkOutDate) {
    query.checkInDate = { $lte: req.query.checkInDate };
    query.checkOutDate = { $gte: req.query.checkOutDate };
  }
  const reservations = await Reservations.find(query)
    .skip(startIndex)
    .limit(limit)
    .populate("customer_id")
    .populate({ path: "room_id", populate: { path: "room_category" } });

  res.status(200).json({
    message: "Reservations retrieved successfully",
    result: reservations,
  });
});

exports.getReservationsForDropdown = catchAsyncErrors(
  async (req, res, next) => {
    const status = req.query.status;
    const branch_id = req.query.branch_id;
    if (!branch_id) {
      return next(new ErrorHandler("Please provide branch id", 400));
    }

    let query = {};
    query.branch_id = req.query.branch_id;
    if (status) {
      if (status === "active") {
        const today = new Date();
        query.checkInDate = { $lte: today };
        query.checkOutDate = { $gte: today };
      }
    }

    const reservations = await Reservations.find(query)
      .populate("customer_id", "name cnic")
      .populate({ path: "room_id",select:'room_category room_number', populate: { path: "room_category",select:'name' } });
    res.status(200).json({
      message: "Operation successfull",
      result: reservations,
    });
  }
);

exports.get = catchAsyncErrors(async (req, res, next) => {
  const reservationId = req.params.id;
  const reservation = await Reservations.findById(reservationId);
  if (!reservation) {
    return next(new ErrorHandler("Reservation not found", 404));
  }
  res.status(200).json({
    message: "Reservation found",
    result: reservation,
  });
});

exports.update = catchAsyncErrors(async (req, res, next) => {
  const reservationId = req.params.id;
  const updateData = req.body;
  const updatedReservation = await Reservations.findByIdAndUpdate(
    reservationId,
    updateData,
    { new: true }
  );
  if (!updatedReservation) {
    return next(new ErrorHandler("Reservation not found", 404));
  }
  res.status(200).json({
    message: "Reservation updated successfully",
    result: updatedReservation,
  });
});

exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const reservationId = req.params.id;
  const deletedReservation = await Reservations.findByIdAndDelete(
    reservationId
  );
  if (!deletedReservation) {
    return next(new ErrorHandler("Reservation not found", 404));
  }
  res.status(200).json({
    message: "Reservation deleted successfully",
    result: deletedReservation,
  });
});
