const mongoose = require('mongoose');
const complainSchema = new mongoose.Schema({
    customer_name: {
        type: String,
        default: "Muhammad Iqbal"
    },
    comlain_title: {
        type: String,
        default: "Internet not working"
    },
    complain_description: {
        type: String,
        default: "Sample description "
    },
    isResolved: {
        type: Numebr,
        default: 0 // 0 for unresolved and 1 for resolved
    }
});

module.exports = mongoose.model('Complains', complainSchema);