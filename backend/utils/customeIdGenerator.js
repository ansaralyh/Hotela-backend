
const Counter = require('./counter.model');

const createDocumentWithCustomId = async (Model, idField, next) => {
    try {
        const counter = await Counter.findByIdAndUpdate(
            { _id: idField },
            { $inc: { sequence_value: 1 } },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        const newDocument = new Model({
            [idField]: counter.sequence_value,
            
        });

        await newDocument.save();

        return newDocument;
    } catch (err) {
        next(err);
    }
};

module.exports = createDocumentWithCustomId;