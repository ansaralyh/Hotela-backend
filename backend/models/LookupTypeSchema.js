const mongoose = require('mongoose');

const lookupTypeSchema = mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide name']
    },
    descripton:{
        type: String,
        required:true
    }
},{timestamps:true})



module.exports = mongoose.model('LookupType',lookupTypeSchema)