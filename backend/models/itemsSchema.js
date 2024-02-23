const mongoose = require('mongoose');
const itemsSchema = new mongoose.Schema({
    mineral_water: {
        type: String,
    },
    mix_tea: {
        type: String,
    },
    sandwitch: {
        type: String,
    },
    chiken_karahi: {
        type: String,
    },
    rotti: {
        type: String,
    },
    salad: {
        type: String,
    },
    raita: {
        type: String,
    },
    cold_drink: {
        type: String,
    },
    chicken_shanshilk: {
        type: String,
    },
    chihken_fried_rice: {
        type: String,
    },
    grill_salad: {
        type: String,
    }

},
    {
        timestamps: true
    });

    module.exports = mongoose.model('Items',itemsSchema)