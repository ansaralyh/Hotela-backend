const mongoose = require('mongoose')


const transactionSchema = new mongoose.Schema({
    hotel_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Hotel'
    },
    branch_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Branch'
    },
    
})