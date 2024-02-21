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
});
// get  all hotels 
exports.index = catchAsyncErrors(async (req, res, next) =>  {
    const hotels= await Hotel.find();
    res.status(200).json({
        messege:"Operation successful",
        result:hotels
    })
});

// get single hotel
exports.get = catchAsyncErrors(async (req, res, next) => {
    const hotel = await Hotel.findById(req.params.id);
    if(!hotel) {
        return next(new ErrorHandler('Hotel not found',404))
    }

    res.status(200).json({
        messege:"Operation successful",
        result:hotel
    })
})

// update hotel 
exports.update = catchAsyncErrors(async (req, res, next) => {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id,req.body,{
        new:true,
        runValidators:true
    });
    if(!hotel) {
        return next(new ErrorHandler('Hotel not found',404))
    }
    res.status(200).json({
        messege:"Operation successful",
        result:hotel
    })
})

// delete  a hotel

exports.destroy = catchAsyncErrors(async(req,res,next) => {
    const hotel = await Hotel.findByIdAndDelete(req.params.id);
    if(!hotel) {
        return next(new ErrorHandler('Hotel not found',404))
    }
    res.status(200).json({
        success: true,
        message: "branch deleted successfully!"
    });
})