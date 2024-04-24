const mongoose = require('mongoose');
const complainsSchema = new mongoose.Schema({
    customer_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref: "customer"
    },
    complain_subject:{
        type:String
    },
    description:{
        type:String
    },
    isResolved:{
        type:Boolean,
        default:false
    },

})

module.exports = mongoose.model('complains',complainsSchema)