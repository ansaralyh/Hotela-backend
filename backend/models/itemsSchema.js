const mongoose = require('mongoose');
const itemsSchema = new mongoose.Schema({
    hotel_id:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Hotel"
    },
    branch_id:{

        type:mongoose.Schema.Types.ObjectId,
        ref:"Branch"
    },
    name:{
        type:String
    },
    cost:{
        type:Number
    }

},
    {
        timestamps:true,
        toJSON:{virtuals:true}
    });

    itemsSchema.virtual('id').get(function(){
        return this._id
    })

    module.exports = mongoose.model('Items',itemsSchema)