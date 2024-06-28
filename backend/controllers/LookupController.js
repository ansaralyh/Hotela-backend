const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const Lookups = require('../models/LookupSchema');

exports.store = catchAsyncError(async (req, res, next) => {
    const lookup = await Lookups.create(req.body);

    res.status(200).json({
        success: true,
        result: lookup,
    });
});


exports.index = catchAsyncError(async (req, res, next) => {
    const lookups = await Lookups.find().populate('lookup_type_id');

    res.status(200).json({
        success: true,
        result: lookups,
    });
});


exports.get = catchAsyncError(async (req, res, next) => {
    const lookup = await Lookups.findById(req.params.id).populate('lookup_type_id');

    if (!lookup) {
        return next(new ErrorHandler('Lookup not found', 404));
    }

    res.status(200).json({
        success: true,
        result: lookup,
    });
});

exports.update = catchAsyncError(async (req, res, next) => {
    let lookup = await Lookups.findById(req.params.id);

    if (!lookup) {
        return next(new ErrorHandler('Lookup not found', 404));
    }

    lookup = await Lookups.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false,
    }).populate('lookup_type_id');

    res.status(200).json({
        success: true,
        result: lookup,
    });
});

exports.destroy = catchAsyncError(async (req, res, next) => {
    const lookup = await Lookups.findByIdAndDelete(req.params.id);
    if (!lookup) {
        return next(new ErrorHandler('Lookup  not found', 404));
    }
    res.status(200).json({
        success: true,
        message: 'Lookup  deleted successfully',
    });

});

exports.getLookupsForDropdown = catchAsyncError(async (req,res,next)=>{
    const id = req.params.id

    if(!id){
        return next(new ErrorHandler('Please provide look up type id',404))
    }

    const lookuptypes = await Lookups.find({lookup_type_id:id});

    res.status(200).json({
        message:"Operation successfull",
        result: lookuptypes
    })
})