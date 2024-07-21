const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Room = require("../models/roomModel");
const Reservations = require("../models/reservationSchema");
const { uploadFile } = require("../utils/uploadFiles");
const path = require("path");
const fs = require("fs");

exports.store = catchAsyncErrors(async (req, res, next) => {
  const { room_category, room_number, branch_id, bed } = req.body;
  // const { images } = req.files;

  // if(!images){
  //   return next(new ErrorHandler("Please Provide Images",400))

  // }
  // if(images.length>5){
  //   return next(new ErrorHandler("Images should not be more then 5",400))
  // }
  if (!room_category || !room_number || !branch_id || !bed) {
    return next(new ErrorHandler("Fields missing", 400));
  }
  // const uploadFolderPath = path.join(__dirname, "../uploads/room_images");

  // const imageUrls = []
  // if (images.length>0) {
  //   if (!fs.existsSync(uploadFolderPath)) {
  //     fs.mkdirSync(uploadFolderPath, { recursive: true });
  //   }
  //   await Promise.all(images.map(async (img)=>{
  //     const fileName = img.name;
  //     const imagePath = path.join(uploadFolderPath, fileName);
  //     await img.mv(imagePath);
  //     const imageUrl = `${req.protocol}://${req.get("host")}/${fileName}`;
  //     imageUrls.push({url:imageUrl})
  //   }))
  // }
  const result = await Room.create({
    room_category,
    room_number,
    hotel_id: req.user.hotel_id,
    branch_id,
    bed,
  });
  res.status(200).json({
    message: "Operation Successful",
    result,
  });
});

//Get all rooms
exports.index = catchAsyncErrors(async (req, res, next) => {
  const { branch_id } = req.query;
  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 404));
  }
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const startIndex = (page - 1) * limit;
  // if (checkInDate && checkOutDate) {
  //   const existingReservations = await Reservations.find({
  //     checkInDate: { $lt: checkOutDate },
  //     checkOutDate: { $gt: checkInDate },
  //   }).distinct("room_id");
  //   const rooms = await Room.find();
  //   const availableRooms = rooms.filter(
  //     (room) => !existingReservations.includes(room._id)
  //   );

  //   return res.status(200).json({
  //     message: "Rooms availability checked successfully",
  //     availableRooms: availableRooms,
  //   });
  // }

  // If no dates provided, fetch all rooms
  const rooms = await Room.find({ branch_id })
    .populate("bed")
    .populate("room_category")
    .skip(startIndex)
    .limit(limit);

  res.status(200).json({
    message: "Operation Successfull",
    result: {
      items: rooms,
      meta: {},
    },
  });
});

exports.getRoomsDropDown = catchAsyncErrors(async (req, res, next) => {
  const branch_id = req.query.branch_id;

  if (!branch_id) {
    return next(new ErrorHandler("Please provide branch id", 404));
  }
  const rooms = await Room.find(
    { branch_id },
    "room_number branch_id hotel_id"
  ).populate("room_category", "name cost");
  res.status(200).json({
    message: "Operation Successful",
    result: rooms,
  });
});

//function to find a room
exports.get = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.params.id).populate("room_category");
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }
  res.status(200).json({
    messege: "Operation successful",
    result: room,
  });
});

//Function to reserve a room
exports.update = catchAsyncErrors(async (req, res, next) => {
  const room = await Room.findById(req.params.id);
  if (!room) {
    return next(new ErrorHandler("Room not found", 404));
  }

  await Room.findByIdAndUpdate({ _id: req.params.id }, req.body, { new: true });
  res.status(200).json({
    messege: "Operation Successfull",
    result: room,
  });
});

exports.destroy = catchAsyncErrors(async (req, res, next) => {
  const roomId = req.params.id;
  const currentRoom = await Room.findByIdAndDelete(roomId);
  if (!currentRoom) {
    return next(new ErrorHandler("room not Found", 404));
  }

  res.status(200).json({
    message: "Operation successfully",
  });
});

exports.checkAvailability = catchAsyncErrors(async (req, res, next) => {
  const { startDate, endDate, branch_id } = req.query;

  if (!branch_id) {
    return next(new ErrorHandler('Please provide branch id', 400));
  }

  if (!startDate || !endDate) {
    return next(new ErrorHandler("Start date and end date are required", 400));
  }

  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime()) || isNaN(end.getTime()) || start >= end) {
    return next(new ErrorHandler("Invalid date range", 400));
  }

  // Find reservations that overlap with the given date range
  const reservations = await Reservations.find({
    branch_id,
    $or: [
      { checkInDate: { $lt: end }, checkOutDate: { $gt: start } },
    ],
  }).populate("rooms.room_id");

  // Create a set of reserved room IDs
  const reservedRoomIds = new Set(
    reservations.flatMap(reservation => 
      reservation.rooms.map(room => room.room_id.toString())
    )
  );

  // Find all rooms for the given branch
  const allRooms = await Room.find({ branch_id }).populate("room_category");

  // Filter out reserved rooms
  const availableRooms = allRooms.filter(
    room => !reservedRoomIds.has(room._id.toString())
  );

  res.status(200).json({
    message: "Rooms available",
    result: availableRooms,
  });
});
