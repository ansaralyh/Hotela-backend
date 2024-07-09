const mongoose = require('mongoose');

const roomCategoryScehma = new mongoose.Schema({
    cost: {
        type: Number,
    },
    name: {
        type: String,
    },
    occupancy: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'Lookup'
    },
    // ammenities: {
    //     air_conditioner: {
    //         type: Number,
    //         default: 0
    //     },
    //     hot_water: {
    //         type: Number,
    //         default: 0
    //     },
    //     wifi: {
    //         type: Number,
    //         default: 0
    //     },
    //     tv:
    //     {
    //         type: Number,
    //         default: 0
    //     },
    //     refrigerator: {
    //         type: Number,
    //         default: 0
    //     }
    // },
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    branch_id:{
        type: mongoose.Schema.Types.ObjectId,
        ref:'Branch'
    }
    
},{
    timestamps:true,
    toJSON:{virtuals:true}
});

roomCategoryScehma.virtual('id').get(function(){
    return this._id
})

const Category = mongoose.model('Category',roomCategoryScehma);
module.exports = Category