const mongoose = require('mongoose');
const Counter = require('./counter.model');

const customerSchema = new mongoose.Schema({
    customer_id: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Enter customer name'],
    },
    cnic: {
        type: Number,
        required: [true, 'Enter customer cnic'],
    },
    gender: {
        type: String,
        required: true,
    },
    checkIn: {
        type: Date,
        required: true,
    },
    checkOut: {
        type: Date,
        required: true,
    },
    otherDetails: [
        {
            email: {
                type: String,
                required: true,
            },
            maritalStatus: {
                type: String,
            },
        },
    ],
    createdAt: {
        type: Date,
        required: true,
        default: Date.now,
    },
});

customerSchema.pre('save', async function (next) {
    const doc = this;


    if (doc.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'customer_id' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );

            doc.customer_id = counter.sequence_value;
            next();
        } catch (err) {
            next(err);
        }
    } else {

        next();
    }
});


const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
