const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({

    name: String,
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    branch_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lookup"
    },
    receipt: {
        type: String
    },
    cost:{
        type: Number
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
expenseSchema.virtual('id').get(function () {
    return this._id
})
module.exports = mongoose.model('Expenses', expenseSchema)