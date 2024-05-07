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

},{
    timestamps:true,
    toJSON:{virtuals:true}
})
complainsSchema.virtual('id').get(function(){
    return this._id
})

module.exports = mongoose.model('complains',complainsSchema)