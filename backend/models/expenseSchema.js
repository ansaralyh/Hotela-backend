const mongoose = require('mongoose');

const expenseSchema = new mongoose.Schema({


    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    branch_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    },
    expense_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lookup"
    },
    receipt:{
        type: String
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true }
});
expenseSchema.virtual('id').get(function () {
    return this._id
})
module.exports = mongoose.model('Expenses', expenseSchema)