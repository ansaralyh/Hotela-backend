const mongoose = require('mongoose');


const userSchema = new mongoose.Schema({
    hotel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    email: {
        type: String,
        unique: true,
       
    },
    password: {
        type: String,
        minLength: [8, "Password cannot be less than 8 characters"],
    },
    name:{
        type:String
    },
    contact:{
        type:String
    },
    cnic: {
        type: String, 
    },
    dateOfBirth: {
        type: Date,
    },
    image: {
        type:String
    },
    role: {
        type: String,
        enum:['owner',"receptionist"],
        default: "owner"
    },
    branch_id :{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    },
    forgetPasswordOtp:{
        type: String,
    },
    isPasswordOtpVerified :{
        type: Boolean,
    },
    emailVerificationOtp:{
        type: String,
    },
    isEmailVerified :{
        type: String,
    }
},{
    timestamps:true,
    toJSON:{virtuals:true}
});
userSchema.virtual('id').get(function(){
    return this._id
})
module.exports = mongoose.model("users", userSchema)