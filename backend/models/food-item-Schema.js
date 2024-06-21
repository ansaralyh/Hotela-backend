const mongoose = require('mongoose');

const foodItemSchema = new mongoose.Schema({
    name:{
        type:String
    }
,
cnic:{
    type:Number
},
contact:{
    type:String
},
itemObjectId:{
         type: mongoose.Schema.Types.ObjectId,
        ref: "Items"
}
},{
    timestamps:true,
    toJSON:{virtuals:true}
});

foodItemSchema.virtual('id').get(function(){
    return this._id
});

module.exports = mongoose.model('foodItems',foodItemSchema)