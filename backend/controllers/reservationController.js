const ErrorHandler = require("../utils/ErrorHandler");
const Reservations = require("../models/reservationSchema");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Invoice = require("../models/invoiceSchema");
const Room = require("../models/roomModel");
const {
  calculateDaysBetweenCheckInOut,
  prettifyDate,
} = require("../utils/dates");
const Rooms = require("../models/roomModel");
const Customer = require("../models/customerScehma");
const customer = require("../models/customerScehma");
const { createTransaction } = require("./transactionController");
const { lookupIds } = require("../utils/lookupIds");
const ObjectId = require("mongodb").ObjectId;
exports.store = catchAsyncErrors(async (req, res, next) => {
  const {
    checkInDate,
    checkOutDate,
    rooms,
    branch_id,
    cnic,
    num_of_people,
    name,
    contact,
    // current_address,
    // permanent_address,
    email,
    gender,
    // marital_status,
    // city,
    extra_matress_charges,
    recieved_amount,
    discount,
  } = req.body;

  if (
    !checkInDate ||
    !checkOutDate ||
    !rooms ||
    !branch_id ||
    !cnic ||
    !name ||
    !contact ||
    // !current_address ||
    !email
    // !gender ||
    // !marital_status ||
    // !city
  ) {
    return next(new ErrorHandler("Fields missing", 400));
  }

  const roomIds = rooms.map((room) => room.room_id);

  const checkIn = new Date(checkInDate).toISOString();
  const checkOut = new Date(checkOutDate).toISOString();
  const overlappingReservations = await Reservations.find({
    branch_id,
    "rooms.room_id": { $in: roomIds },
    $or: [{ checkInDate: { $lt: checkOut }, checkOutDate: { $gt: checkIn } }],
  })
    .populate("rooms.room_id", "room_number")
    .exec();

  if (overlappingReservations.length > 0) {
    const conflictingRooms = [];
    overlappingReservations.forEach((reservation) => {
      reservation.rooms.forEach((room) => {
        if (roomIds.includes(room.room_id._id.toString())) {
          conflictingRooms.push(room.room_id.room_number);
        }
      });
    });
    if (conflictingRooms.length === 1) {
      return next(
        new ErrorHandler(
          `Room ${conflictingRooms.map(
            (r) => r
          )} is already reserved from ${prettifyDate(
            overlappingReservations[0].checkInDate
          )} to ${prettifyDate(overlappingReservations[0].checkOutDate)}`,
          400
        )
      );
    } else {
      return next(
        new ErrorHandler(
          `Rooms ${conflictingRooms.map(
            (r) => r
          )} are already reserved from from ${prettifyDate(
            overlappingReservations[0].checkInDate
          )} to ${prettifyDate(overlappingReservations[0].checkOutDate)}`,
          400
        )
      );
    }
  } else {
    const existingCustomer = await customer.findOne({ cnic });
    const days = calculateDaysBetweenCheckInOut(checkInDate, checkOutDate);
    const reqRooms = await Room.find({
      branch_id,
      _id: { $in: rooms.map((room) => new ObjectId(room.room_id)) },
    }).populate("room_category");
    let total_amount =
      reqRooms
        .map((r) => r.room_category.cost)
        .reduce((first, second) => first + second, 0) * Number(days);
    if (recieved_amount) {
      total_amount = total_amount - recieved_amount;
    }
    if (discount) {
      total_amount = total_amount - discount;
    }
    if (existingCustomer) {
      const reservation = await Reservations.create({
        customer_id: existingCustomer._id,
        checkInDate,
        checkOutDate,
        rooms,
        branch_id,
        num_of_people,
        extra_matress_charges,
        total_days: days,
        hotel_id: req.user.id,
        invoice: {
          total_amount,
          discount,
          recieved_amount,
        },
      });
      if (recieved_amount && recieved_amount >= 1) {
        createTransaction({
          hotel_id: req.user.hotel_id,
          branch_id,
          amount: recieved_amount,
          description: "Reservation",
          status: lookupIds.TRANSACTION_STATUS_CREDIT,
        });
      }
      res.status(200).json({
        message: "Operation successful",
        result: reservation,
      });
    } else {
      const customer = await Customer.create({
        name,
        cnic,
        email,
        // permanent_address,
        // current_address,
        contact,
        gender,
        // marital_status,
        // city,
        branch_id,
        hotel_id: req.user.hotel_id,
      });
      const reservation = await Reservations.create({
        customer_id: customer._id,
        checkInDate,
        checkOutDate,
        rooms,
        branch_id,
        num_of_people,
        extra_matress_charges,
        hotel_id: req.user.id,
        invoice: {
          total_amount,
          discount,
          recieved_amount,
        },
      });
      if (recieved_amount && recieved_amount >= 1) {
        createTransaction({
          hotel_id: req.user.hotel_id,
          branch_id,
          amount: recieved_amount,
          description: "Reservation",
          status: lookupIds.TRANSACTION_STATUS_CREDIT,
        });
      }
      res.status(200).json({
        message: "Operation successful",
        result: reservation,
      });
    }
  }
});

exports.index = catchAsyncErrors(async (req, res, next) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  const query = {};
  query.branch_id = req.query.branch_id;
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const status = req.query.status;
  if (status && status !== "all") {
    query.status = status;
  }
  if (startDate && endDate) {
    query.checkInDate = { $lte: endDate };
    query.checkOutDate = { $gte: startDate };
  }
  const reservations = await Reservations.find(query)
    .skip(startIndex)
    .limit(limit)
    .populate("customer_id")
    .populate({ path: "rooms.room_id", populate: { path: "room_category" } })
    .populate("invoice.items.item_id");

  const count = await Reservations.countDocuments(query);
  const total_pages = count < limit ? 1 : Math.ceil(count / limit);

  res.status(200).json({
    message: "Reservations retrieved successfully",
    result: {
      items: reservations,
      meta: {
        total_items: count,
        item_count: reservations.length,
        items_per_page: limit,
        current_page: page,
        total_pages,
      },
    },
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
      .populate({
        path: "room_id",
        select: "room_category room_number",
        populate: { path: "room_category", select: "name" },
      });
    res.status(200).json({
      message: "Operation successfull",
      result: reservations,
    });
  }
);

exports.get = catchAsyncErrors(async (req, res, next) => {
  const reservationId = req.params.id;
  const reservation = await Reservations.findById(reservationId)
    .populate({ path: "rooms.room_id", populate: { path: "room_category" } })
    .populate("customer_id")
    .populate("invoice.items.item_id"); // Populate item_id inside invoice.items array

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

exports.addItemstoReservationInvoice = catchAsyncErrors(
  async (req, res, next) => {
    const { items, recieved_amount } = req.body;
    const reservation_id = req.params.reservation_id;
    if (!reservation_id) {
      return next(new ErrorHandler("Please provide reservation id", 404));
    }

    // if (items.length === 0) {
    //   return next(
    //     new ErrorHandler("Please provide atleast one item to add", 400)
    //   );
    // }

    const reservation = await Reservations.findById(reservation_id);
    if (!reservation) {
      return next(new ErrorHandler("Reservation not found"));
    }
    if (items.length > 0) {
      await Promise.all(
        items.map((item) => {
          reservation.invoice.items.push(item);
          reservation.invoice.total_amount =
            Number(reservation.invoice.total_amount) +
            Number(item.total_amount);
        })
      );
    }
    if (Number(recieved_amount) > 0) {
      reservation.invoice.recieved_amount =
        reservation.invoice.recieved_amount + Number(recieved_amount);
    }
    await reservation.save();

    res.status(200).json({
      message: "Operation successfull",
      result: reservation,
    });
  }
);

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

exports.addPayment = catchAsyncErrors(async (req, res, next) => {
  const reservationId = req.params.reservationId;
  const amount = req.body?.amount;
  if (!reservationId || !amount) {
    return next(new ErrorHandler("Fields Missing", 404));
  }
  const reservation = await Reservations.findById(reservationId);
  if (!reservation) {
    return next(
      new ErrorHandler(`Reservation not found with id ${reservationId}`, 404)
    );
  }
  if (
    Number(reservation.invoice.recieved_amount + Number(amount)) >
    reservation.invoice.total_amount
  ) {
    return next(
      new ErrorHandler(
        "Received amount should not be more then total remaining amount"
      )
    );
  }

  reservation.invoice.recieved_amount =
    Number(reservation.invoice.recieved_amount) + Number(amount);
  await reservation.save();

  res.status(200).json({
    message: "Operation Successfull",
    result: [],
  });
});
