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
        type: String,
        enum: ['male', 'female','other']

    },
   
    email: {
        type: String,
        required: true,
    },
    maritalStatus: {
        type: String
    },
    contact:{
        type:String
    },
    city: {
        type: String,
    },
    currentAddress: {

        type: String,
    },
    permanentAddress: {
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
