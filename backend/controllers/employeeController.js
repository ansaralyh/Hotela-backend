const ErrorHandler = require('../utils/ErrorHandler');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
const catchAsyncErrors = require('../middleware/catchAsyncErrors')
const sendToken = require("../utils/jwtToken");
const Employee = require('../models/employeeSchema');

/**Create Single Employee */
exports.store = catchAsyncErrors(async (req, res, next) => {
    
    let { name, cnic, gender, type, contact, joiningDate,email,password } = req.body;
    if (!name || !cnic || !gender || !type || !contact || !joiningDate) {
        return next(new ErrorHandler('Fields missing'))
    }
    const employee = await Employee.findOne({ $or: [{ cnic }, { email }] });

    if(employee){
        return next (new ErrorHandler('Employee already exists',409));
    }
    else{
        const hashedPassword = await bcrypt.hash(password,salt);
        // console.log(hashedPassword)
        req.body.password = hashedPassword;
        const employee = await Employee.create(req.body);
        res.status(200).json({
            success:true,
            messege:'Employee created successfully'
        })
    }



  
});


/**Get single employee by empID */
exports.get = catchAsyncErrors(async (req, res, next) => {
    const singleEmployee = await Employee.findById(req.params.id);
    if (!singleEmployee) {
        return next(new ErrorHandler(`Employee with ID ${req.params.id} not found`, 404));
    }

    res.status(200).json({
        success: true,
        singleEmployee
    })
});



/**Get all employess */
exports.index = catchAsyncErrors(async (req, res, next) => {
    const {type}=req.query;
    const query={};
    if(type){
        query.type=type;
    }

    const allEmployees = await Employee.find(query).select('-password');
    
    res.status(200).json({
        success: true,
        allEmployees
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
        success: true,
        message: "Field updated successfully",
        updateField
    });
});


/**Delete an employee */
exports.destroy = catchAsyncErrors(async (req, res, next) => {
    const employeeId = req.params.id;
    
    const currentEmplpoyee = await Employee.findByIdAndDelete( employeeId );
    console.log(currentEmplpoyee)
    if (!currentEmplpoyee) {
        return next(new ErrorHandler('Employee not Found', 404));
    }
   

    res.status(200).json({
        success: true,
        message: 'Employee remooved successfully'
    })
})

