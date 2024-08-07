const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema({
  hotel_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Hotel",
  },
  branch_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Branch",
  },
  description: {
    type: String,
  },
  amount: {
    type: Number,
  },
  status: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Lookup",
  },
});
transactionSchema.virtual('id').get(function(){
    return this._id
});

module.exports = mongoose.model("Transaction", transactionSchema);
