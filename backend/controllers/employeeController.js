const ErrorHandler = require('../utils/ErrorHandler');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const Employee = require('../models/employeeSchema');
const { request } = require('express');

/**Create  Employee */
exports.store = catchAsyncErrors(async (req, res, next) => {
    
    const {type,name,cnic,gender,contact,joiningDate,email,emergencyContact,hotel_id,branch_id} = req.body;


    const employee = await Employee.create({type,name,cnic,gender,contact,joiningDate,emergencyContact,branch_id,hotel_id:req.body.hotel_id});
    res.status(200).json({
        messege:"Operation successful",
        result: employee
    })

  
});

/**Get single employee by empID */
exports.get = catchAsyncErrors(async (req, res, next) => {
    const singleEmployee = await Employee.findById(req.params.id);
    if (!singleEmployee) {
        return next(new ErrorHandler(`Employee with ID ${req.params.id} not found`, 404));
    }
    res.status(200).json({
        messege: "Operation successful",
        result: singleEmployee
    })
});



/**Get all employess */
exports.index = catchAsyncErrors(async (req, res, next) => {
    const { type } = req.query;
    const query = {};
    if (type) {
        query.type = type;
    }
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const startIndex = (page - 1) * limit;
    const allEmployees = await Employee.find(query).skip(startIndex).limit(limit);
    if(!allEmployees){
        return next(new ErrorHandler("Employees not found", 404));
    }
    res.status(200).json({
        messege: "Operation  successful",
        result: allEmployees
    })
});


/** Update employee */
exports.update = catchAsyncErrors(async (req, res, next) => {
    const employeeId = req.params.id;
    console.log(employeeId)
    const updateField = req.body;
    const updatedData = await Employee.findByIdAndUpdate(employeeId, updateField, {
        new: true,
        runValidators: true
    });
    if (!updatedData) {
        return res.status(404).json({
            success: false,
            message: "Employee not found"
        });
    }
    await updatedData.save();
    res.status(200).json({
        message: "Operation successfully",
        result: updateField
    });
});


/**Delete an employee */
exports.destroy = catchAsyncErrors(async (req, res, next) => {
    const employeeId = req.params.id;

    const currentEmplpoyee = await Employee.findByIdAndDelete(employeeId);
    console.log(currentEmplpoyee)
    if (!currentEmplpoyee) {
        return next(new ErrorHandler('Employee not Found', 404));
    }


    res.status(200).json({
        message: 'Operation successfully'
    })
})

