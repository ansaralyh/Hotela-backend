const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const Employee = require('../models/employeeSchema'); 

/**Create Single Employee */
exports.store = catchAsyncErrors(async (req, res, next) => {
    const {name,cnic,gender,type,contact,joiningDate} = req.body;

    
    if(!name || !cnic || !gender || !type || !contact || !joiningDate){
        return next(new ErrorHandler('Fields missing'))
    }

    const employee = await Employee.create(req.body);
    res.status(201).json({
        success:true,
        employee
    })
});

/**Get single employee by empID */


exports.get = catchAsyncErrors(async (req, res, next) =>{
    const singleEmployee = await Employee.findById(req.params.id);
        if(!singleEmployee) {
            return next(new ErrorHandler(`Employee with ID ${req.params.id} not found`,404));
        }

        res.status(200).json({
            success:true,
            singleEmployee
        })
});

/**Get all employess */
exports.index = catchAsyncErrors(async (req, res, next) => {
    const allEmployees = await Employee.find();
    if(!allEmployees)
    {
        return next(new ErrorHandler('Employees not found'))
    }
    res.status(200).json({
        success:true ,
        allEmployees})
});

/** Update employee */

exports.update = catchAsyncErrors( async  (req,res,next)=> {
    console.log(req.body)
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
        success: true,
        message: "Field updated successfully",
        updateField
    });
});

/**Delete an employee */

exports.destroy = catchAsyncErrors(async(req, res, next) => {
    const employeeId = req.params.employeeId;
    const currentEmplpoyee = await Employee.findOne({employeeId});
    if (!currentEmplpoyee) {
        return next(new ErrorHandler('Employee not Found',404));
    }
    await Employee.deleteOne({employeeId});

    res.status(200).json({
        success:true,
        message:'Employee remooved successfully'
    })
})

