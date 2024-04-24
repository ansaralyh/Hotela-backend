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

    const complains = await Complains.find(filter);

    if (complains.length === 0 || !complains) {
        return next(new ErrorHandler('Complains not found', 404));
    } 

    res.status(200).json({
        message: "Operation successful",
        result: complains
    });
});

