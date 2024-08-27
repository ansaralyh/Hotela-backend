const mongoose = require('mongoose');

const employeeSchema = new mongoose.Schema({

    possition: {
        type: String, //1.Manager 2.Chef, 3.Room Cleaner 
    },
    name: {
        type: String,
    },
    cnic: {
        type: String,
        unique: true,
    },
    gender: {
        type: String,
    },
    contact: {
        type: String,
    },
    joiningDate: {
        type: Date,
    },
    email: {
        type: String,

    },
    address: {
        type: String,
    },
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    branch_id: {

        type: mongoose.Schema.Types.ObjectId,
        ref: "Branch"
    }
},{
    timestamps:true,
    toJSON:{virtuals:true}
});

employeeSchema.virtual('id').get(function(){
    return this._id
})

const Employee = mongoose.model('Employee', employeeSchema);

module.exports = Employee;
