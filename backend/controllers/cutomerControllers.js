const Customer = require('../models/customerScehma');
const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');


// Create customer
exports.createCustomer = catchAsyncErrors(async (req, res, next) => {
    const { customer_id, name, cnic, gender, checkIn, checkOut, otherDetails } = req.body;

    try {
        const newCustomer = new Customer({
            customer_id,
            name,
            cnic,
            gender,
            checkIn,
            checkOut,
            otherDetails,
        });

        await newCustomer.save();

        res.status(201).json({
            success: true,
            data: newCustomer,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 400));
    }
});

// Get single customer by customer_id

exports.getSingleCustomer = catchAsyncErrors(async (req, res, next) => {
    try {
        const customer = await Customer.findOne({ customer_id: req.params.customer_id });

        if (!customer) {
            return next(new ErrorHandler("No customer found with that Id", 404));
        }

        res.status(200).json({
            success: true,
            customer,
        });
    } catch (error) {
        next(new ErrorHandler(error.message, 500));
    }
});


// Get all customers

exports.getAllCustomers = catchAsyncErrors(async (req, res, next) => {
    const allCustomers = await Customer.find();
    if (!allCustomers) {
        return next(new ErrorHandler('Customers not found'));
    }
    res.status(200).json({
        success: true,
        allCustomers
    })
});

//Update customer details
exports.updateCustomer = catchAsyncErrors(async (req, res, next) => {
    const customer_id = req.params.customer_id;
    const updatedFields = req.body;

    delete updatedFields.customer_id;

    const currentCustomer = await Customer.findOne({ customer_id });

    if (!currentCustomer) {
        return next(new ErrorHandler(`Customer not found with this ID: ${customer_id}`));
    }

    Object.assign(currentCustomer, updatedFields);
    await currentCustomer.save();

    res.status(200).json({
        success: true,
        updatedCustomer: currentCustomer
    });
});


// Delete a customer by customer id

exports.deleteCustomer = catchAsyncErrors(async(req,res,next)=>{
    const customer_id = req.params.customer_id;
    const currentCustomer = await Customer.findOne({ customer_id });
    if (!currentCustomer) {
        return next(new ErrorHandler(`Customer not found with this ID: ${customer_id}`));
    }
    await Customer.deleteOne({customer_id});
    res.status(200).json({
        success:true,
        message:'Customer removed successfully',
        deletedCustomer:currentCustomer
    })
})
// delete all customers
exports.deleteAllCustomers = catchAsyncErrors(async (req, res, next) => {
    const allCustomers = await Customer.find();

    if (!allCustomers || allCustomers.length === 0) {
        return next(new ErrorHandler('No customers found to delete'));
    }

    await Customer.deleteMany({});

    res.status(200).json({
        success: true,
        message: 'All customers deleted successfully',
    });
});

