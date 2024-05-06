const mongoose = require('mongoose');

const lookupSchema = mongoose.Schema({
    lookup_type_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'LookupType',
    },
    name : {
        type:String
    },
    description:{
        type: String
    }
,},{timestamps:true})


module.exports = mongoose.model('Lookup',lookupSchema)