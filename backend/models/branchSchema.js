const mongoose = require('mongoose');
const Counter = require('./counter.model');

const branchSchema = new mongoose.Schema({
    branch_id: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: [true, 'Please enter the branch name'],
    },
    receptionist: {
        type: mongoose.Schema.Types.ObjectId,
    },
    location: {
        type: String,
        // required: [true, 'Enter branch location']
    },
    description: {
        type: String,
        // required: [true, 'Enter description']
    },
    branchImage: {
        public_id: {
            type: String,
            required: true,
        },
        url: {
            type: String,
            required: true,
        },
    },
    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    }
});

branchSchema.pre('save', async function(next) {
    const doc = this;
    if (doc.isNew) {
        try {
            const counter = await Counter.findByIdAndUpdate(
                { _id: 'branch_id' },
                { $inc: { sequence_value: 1 } },
                { new: true, upsert: true, setDefaultsOnInsert: true }
            );
            doc.branch_id = counter.sequence_value;
            next();
        } catch (error) {
            next(error);
        }
    } else {
        next();
    }
});

const Branch = mongoose.model('Branch', branchSchema);
module.exports = Branch;
