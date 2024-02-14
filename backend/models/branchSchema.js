const mongoose = require('mongoose');
const Counter = require('./counter.model');

const branchSchema = new mongoose.Schema({
   
    name: {
        type: String,
        required: [true, 'Please enter the branch name'],
    },
    receptionist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "receptionist",
    },
    location: {
        type: String,
        required: [true, 'Enter branch location']
    },
    description: {
        type: String,
        required: [true, 'Enter description']
    },
    branchImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    }
},{
    timestamps:true
});




const Branch = mongoose.model('Branch', branchSchema);
module.exports = Branch;
