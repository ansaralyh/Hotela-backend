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
},{  timestamps:true,
    toJSON:{virtuals:true}})

    lookupTypeSchema.virtual('id').get(function(){
        return this._id
    })

module.exports = mongoose.model('LookupType',lookupTypeSchema)