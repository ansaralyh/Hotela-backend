const ErrorHandler = require('../utils/ErrorHandler');
const bcrypt = require('bcrypt');
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const Employee = require('../models/employeeSchema'); 

/**Create Single Employee */
exports.createEmployee = catchAsyncErrors(async (req, res, next) => {
    
    const {
        employeeId,
        employeeName,
        cnic,
        position,
        gender,
        contact,
        joiningDate,
        email,
        maritalStatus,
        emergencyContact,
        city,
        currentAddress,
        permanentAddress,
    } = req.body;

    
    const newEmployee = new Employee({
        employeeId,
        employeeName,
        cnic,
        position,
        gender,
        contact,
        joiningDate,
        email,
        maritalStatus,
        emergencyContact,
        city,
        currentAddress,
        permanentAddress,
    });

   
    await newEmployee.save();

    res.status(201).json({
        success: true,
        message: 'Employee created successfully',
        newEmployee,
    });
});

/**Get single employee by empID */


exports.getSingleEmployee = catchAsyncErrors(async (req, res, next) =>{
    const singleEmployee = await Employee.findOne({
        employeeId :req.params.employeeId });
        if(!singleEmployee) {
            return next(new ErrorHandler(`Employee with ID ${req.params.employeeId} not found`,404));
        }

        res.status(200).json({
            success:true,
            singleEmployee
        })
});

/**Get all employess */
exports.getAllEmp = catchAsyncErrors(async (req, res, next) => {
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

exports.updateEmployee = catchAsyncErrors( async  (req,res,next)=> {
    const employeeId = req.params.employeeId;
    const updatedFields = req.body;

    const existingEmployee = await Employee.findOne({ employeeId });

    if(!existingEmployee){
        return next(new ErrorHandler("No such employee exist",404)) ;
    }
    Object.assign(existingEmployee, updatedFields);
    await existingEmployee.save();

    res.status(200).json({
        success:true,
        message:"Updated Successfully" ,
        updatedEmployee:existingEmployee
    })
});

/**Delete an employee */

exports.deleteEmployee = catchAsyncErrors(async(req, res, next) => {
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

