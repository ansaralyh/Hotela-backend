const mongoose = require('mongoose');
const roomSchema = new mongoose.Schema({
    room_category: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category"
    },
    room_number: {
        type: Number,
    },
    images: [
        {
            type: String
        }
    ],
    hotel_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Hotel"
    },
    isReserved: {
        type: Number, // 0 for available and 1 for reserved
        default: 0
    }
});

module.exports = mongoose.model('Room', roomSchema);