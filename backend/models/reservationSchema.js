const mongoose = require("mongoose");

const reservationSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    checkInDate: {
      type: Date,
    },
    checkOutDate: {
      type: Date,
    },
    rooms: [
      {
        room_id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Room",
        },
      },
    ],
    numOfPeople: {
      type: Number,
    },
    extraMetressCharges: {
      type: Number,
    },
    total_days:{
        type: Number
    },
    invoice: {
      items: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Items",
        },
      ],
      status: {
        type: String,
        enum: ["paid", "unpaid"],
        default: "unpaid",
      },

      total_amount: {
        type: Number,
      },
      recieved_amount: {
        type: Number,
      },
      discount: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
reservationSchema.virtual("id").get(function () {
  return this._id;
});

module.exports = mongoose.model("Reservations", reservationSchema);
