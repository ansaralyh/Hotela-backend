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
,},{  timestamps:true,
    toJSON:{virtuals:true}})

    lookupSchema.virtual('id').get(function(){
        return this._id
    })


module.exports = mongoose.model('Lookup',lookupSchema)