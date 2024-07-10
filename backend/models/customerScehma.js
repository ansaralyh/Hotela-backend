const mongoose = require('mongoose');

const customerSchema = new mongoose.Schema({

    name: {
        type: String,

    },
    cnic: {
        type: String,
        unique:true

    },
    gender: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Lookup'

    },
   
    email: {
        type: String,
        required: true,
    },
    marital_status: {
         type: mongoose.Schema.Types.ObjectId,
        ref:'Lookup'
    },
    contact:{
        type:String
    },
    city: {
        type: String,
    },
    current_address: {

        type: String,
    },
    permanent_address: {
        type: String,
    }
    ,
    hotel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    branch_id:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    }
},{
    timestamps:true,
    toJSON:{virtuals:true}
});

customerSchema.virtual('id').get(function(){
    return this._id
})



  

const customer = mongoose.model('customer', customerSchema);
module.exports = customer;
