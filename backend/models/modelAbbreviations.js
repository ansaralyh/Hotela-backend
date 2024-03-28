const mongoose = require('mongoose');

const modelAbbreviationsSchema = new mongoose.Schema({
    Employee: {
        type: String,
        default: "EM"
    },
    Customer: {
        type: String,
        default: "CUS"
    },
    Room: {
        type: String,
        default: "R"
    },
    Transaction: {
        type: String,
        default: "TR"
    },
    Booking: {
        type: String,
        default: "B"
    },
    Invoice: {
        type: String,
        default: "IN"
    },
    Category: {
        type: String,
        default: "C"
    },
    Items: {
        type: String,
        default: "I"
    }
});

module.exports = mongoose.model("ModelAbbreviations", modelAbbreviationsSchema);
