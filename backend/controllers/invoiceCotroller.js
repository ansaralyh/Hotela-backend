const ErrorHandler = require('../utils/ErrorHandler');
const catchAsyncError = require('../middleware/catchAsyncErrors');
const Invoice = require('../models/invoiceSchema');

exports.store = catchAsyncError(async (req, res, next) => {
    const invoice = await Invoice.create(req.body);
    res.status(200).json({
        messege:"Operation successfull",
        result:invoice
    })
})

// get single invoice
exports.get = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const invoice = await Invoice.findById(id);
    if (!invoice) {
        return next(new ErrorHandler("Invoice not found", 404));
    }
    res.status(200).json({
        message: "Operation successful",
        result: invoice
    });
});


// get all invoices
exports.index = catchAsyncError(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1; 
    const limit = parseInt(req.query.limit) ||10; 

    const startIndex = (page - 1) * limit; 

    const invoices = await Invoice.find().skip(startIndex).limit(limit); 
    if(!invoices){
        return next(new ErrorHandler("Invoices not found", 404));
    }

    res.status(200).json({
        message: "Operation successful",
        results: invoices
    });
});


// update invoice
exports.update = catchAsyncError(async (req, res, next) => {
    console.log(req.body);
  
    const invoiceId = req.params.id;
    console.log(invoiceId);
    const updateData = req.body;
    const updatedInvoice = await Invoice.findByIdAndUpdate(invoiceId, updateData, {
        new: true,
        runValidators: true,
    });
    if (!updatedInvoice) {
        return res.status(404).json({
            success: false,
            message: 'Invoice not found',
        });
    }
    res.status(200).json({
        success: true,
        result: updatedInvoice
    });
});


// delete invoice
exports.destroy = catchAsyncError(async (req, res, next) => {
    const { id } = req.params;
    const invoice = await Invoice.findByIdAndDelete(id);
    if (!invoice) {
        return next(new ErrorHandler("Invoice not found", 404));
    }
    res.status(200).json({
        message: "Invoice deleted successfully",
        
    });
});
