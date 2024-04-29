const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const lookupTypeSchema = require('../models/LookupTypeSchema')

exports.store = catchAsyncError(async (req, res, next) => {
    const { name, description } = req.body;
    const result = await lookupTypeSchema.create({
        name,
        description
    });
    res.status(200).json({
        success: true,
        message: 'Lookup type created successfully',
        data: result,
    });
});

exports.index = catchAsyncError(async (req, res, next) => {
    const lookupTypes = await lookupTypeSchema.find();

    res.status(200).json({
        success: true,
        message: 'Lookup types retrieved successfully',
        result: lookupTypes,
    });
});

exports.get = catchAsyncError(async (req, res, next) => {
    const lookupType = await lookupTypeSchema.findById(req.params.id);

    if (!lookupType) {
        return next(new ErrorHandler('Lookup type not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Lookup type retrieved successfully',
        result: lookupType,
    });
});

exports.update = catchAsyncError(async (req, res, next) => {
    const lookupType = await lookupTypeSchema.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
    });

    if (!lookupType) {
        return next(new ErrorHandler('Lookup type not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Lookup type updated successfully',
        result: lookupType,
    });
});

exports.destroy = catchAsyncError(async (req, res, next) => {
    const lookupType = await lookupTypeSchema.findByIdAndDelete(req.params.id);

    if (!lookupType) {
        return next(new ErrorHandler('Lookup type not found', 404));
    }

    res.status(200).json({
        success: true,
        message: 'Lookup type deleted successfully',
    });
});