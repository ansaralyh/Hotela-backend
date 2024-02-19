const ErrorHandler = require('../utils/ErrorHandler')
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const Hotel =  require('../models/hotelSchema');

exports.store = catchAsyncErrors(async(req,res,next) =>{
    const {name,email,location,contact,logo} = req.body;
    if(!contact || !name || !email || !location || !logo){
        return next(new ErrorHandler('Fields missing',400));
    }
    const hotel = await Hotel.create(req.body);
    res.status(201).json({
        messege:"Operation successful",
        result:hotel
    })
})
