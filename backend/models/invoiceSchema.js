const mongoose = require("mongoose");

const invoiceSchema = new mongoose.Schema(
  {
    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    items: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items",
      },
    ],
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "customer",
    },
    reservation_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Reservations",
    },
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
    return_amount: {
      type: Number,
    },
    discount: {
      type: Number,
    },
  },
  {
    timestamps: true,
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);

invoiceSchema.virtual("id").get(function () {
  return this._id;
});
module.exports = mongoose.model("Invoice", invoiceSchema);
