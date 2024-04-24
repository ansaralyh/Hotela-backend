const ErrorHandler = require("../utils/ErrorHandler");
const catchAsyncErrors = require("../middleware/catchAsyncErrors");
const Complains = require('../models/complainsSchema');

exports.store = catchAsyncErrors(async (req, res, next) => {
    const { customer_id, complain_subject, description } = req.body;
    if (!customer_id || !description || !complain_subject) {
        return next(new ErrorHandler("Fields missing", 400));
    }

    try {
        const result = await Complains.create({
            customer_id,
            complain_subject,
            description
        });

        res.status(200).json({
            success: true,
            message: "Complaint registered successfully",
            result
        });
    } catch (error) {
        return next(error);
    }
});

exports.index = catchAsyncErrors(async (req, res, next) => {
    let query = req.query;
    let filter = {};

    if (query.isResolved) {
        filter.isResolved = query.isResolved === 'true';
    }

    const complains = await Complains.find(filter)
        .populate({
            path: "customer_id",
            select: "name"
        });;

    if (complains.length === 0 || !complains) {
        return next(new ErrorHandler('Complains not found', 404));
    }
    // Get total count of complaints
    const totalCount = await Complains.countDocuments();

    // Get count of resolved complaints
    const resolvedCount = await Complains.countDocuments({ isResolved: true });

    // Calculate count of unresolved complaints
    const unresolvedCount = totalCount - resolvedCount; 
    
    res.status(200).json({
        message: "Operation successful",
        result: complains,
        totalCount,
        resolvedCount,
        unresolvedCount
    });
});

exports.get = catchAsyncErrors(async (req, res, next) => {
    const complain = req.params.id;
    const result = await Complains.findById(complain)
        .populate({
            path: "customer_id",
            select: "name"
        });
    if (!result) {
        return next(new ErrorHandler("Couldn't find customer", 404))
    }
    res.status(200).json({
        messege: "Operation successfull",
        result
    })
})

exports.updateComplainStatus = catchAsyncErrors(async (req, res, next) => {
    const compplain_id = req.params.id;

    const complain = await Complains.findById(compplain_id);

    if (!complain) {
        return next(new ErrorHandler('Complain not found', 404));
    }

    const updatedComplain = await Complains.findByIdAndUpdate(compplain_id, {
        isResolved:!complain.isResolved,
    }, { new: true });

    res.status(200).json({
        message: "Complain status updated successfully",
        result: updatedComplain,
    });
});

