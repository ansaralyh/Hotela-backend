const mongoose = require('mongoose');

const branchSchema = new mongoose.Schema({

    name: {
        type: String,
    },

    location: {
        type: String,
    },
    description: {
        type: String,
    },
    branchImage: {
        type: String
    },
    hotel_id:{ // image
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    }
}, 
{
    timestamps: true
});




const Branch = mongoose.model('Branch', branchSchema);
module.exports = Branch;
