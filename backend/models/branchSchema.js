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
    image:
    {
        type: String,
    }
    ,
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    petty_cash:{
        type:Number,
        default: 0
    }

},
    {
        timestamps: true,
        toJSON:{virtuals:true}
    });

branchSchema.virtual('id').get(function(){
    return this._id
});


const Branch = mongoose.model('Branch', branchSchema);
module.exports = Branch;




