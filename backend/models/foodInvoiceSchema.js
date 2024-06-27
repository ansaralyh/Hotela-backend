const mongoose = require("mongoose");

const foodInvoiceSchema = new mongoose.Schema({
  name: {
    type: String,
  },
  items: [
    {
      item_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Items",
      },
      quantity: {
        type: Number,
      },
      price: {
        type: Number,
      },
      total_price: {
        type: Number,
      },
    },
  ],
  total_amount: {
    type: Number,
  },
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
});
foodInvoiceSchema.virtual("id").get(function () {
  return this._id;
});

module.exports = mongoose.model("FoodInvoice", foodInvoiceSchema);
