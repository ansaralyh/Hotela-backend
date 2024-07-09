const mongoose = require("mongoose");
const roomSchema = new mongoose.Schema(
  {
    room_category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
    },
    room_number: {
      type: Number,
      unique: true,
    },
    // images: [
    //   {
    //     url: String,
    //   },
    // ],

    hotel_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
    },
    branch_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Branch",
    },
    bed: String
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
  }
);
roomSchema.virtual("id").get(function () {
  return this._id;
});

module.exports = mongoose.model("Room", roomSchema);
