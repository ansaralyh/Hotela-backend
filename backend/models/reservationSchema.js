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
          item_id:{
            type: mongoose.Schema.Types.ObjectId,
            ref: "Items",
          },
          quantity: Number,
          unit_price: Number,
          total_amount: Number,
          date: Date
        },
      ],

      total_amount: {
        type: Number,
      },
      recieved_amount: {
        type: Number,
        default: 0
      },
      discount: {
        type: Number,
      },
    },
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject:{virtuals: true}
  }
);
reservationSchema.virtual("id").get(function () {
  return this._id;
});
reservationSchema.virtual("rent_per_day").get(function () {
  const total = this.rooms.map((room)=> room.room_id.room_category?.cost).reduce((first,second)=> first + second , 0);
  return Number(total);
});
reservationSchema.virtual("total_room_rent").get(function () {
  return this.rooms.map((room)=> room.room_id.room_category?.cost).reduce((first,second)=> first + second , 0) * this.total_days;
});

reservationSchema.virtual('invoice.status').get(function () {
  if (this.invoice.total_amount > this.invoice.recieved_amount) {
    return 'partial';
  } else if (this.invoice.total_amount === this.invoice.recieved_amount) {
    return 'paid';
  } else {
    return 'unpaid';
  }
});


reservationSchema.set('toJSON', {
  virtuals: true,
  transform: function (doc, ret) {
    if (ret.invoice) {
      ret.invoice.status = doc.invoice.status;
    }
    return ret;
  }
});

module.exports = mongoose.model("Reservations", reservationSchema);
