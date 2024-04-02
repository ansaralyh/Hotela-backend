const mongoose = require('mongoose');
const ModelAbbreviations = require('../models/modelAbbreviations');

async function generateCustomID(modelName) {
    try {
        console.log('model name :', modelName);
        const abbreviation = await ModelAbbreviations.findOne({});
        console.log('abbreviation :', abbreviation)
        if (!abbreviation || !abbreviation[modelName]) {
            throw new Error(`Model abbreviation not found for model: ${modelName}`);
        }

        const Model = mongoose.model(modelName);
        const lastDocument = await Model.findOne({}, {}, { sort: { 'createdAt': -1 } });
        let newId = "001"; // DEFAULT STARTING ID

        if (lastDocument) {
            const lastId = lastDocument.id;
            const numericPart = parseInt(lastId.substr(abbreviation[modelName].length));
            newId = ("000" + (numericPart + 1)).slice(-3);
        }

        return abbreviation[modelName] + newId;
    } catch (error) {

        throw error;
    }
}

function generateCustomIDMiddleware(modelName) {
    return async function (next) {
        try {
            if (!this.isNew) {
                return next();
            }

            const newId = await generateCustomID(modelName);
            this._id = newId;

            next();
        } catch (error) {
            next(error);
        }
    };
}

module.exports = {
    generateCustomID,
    generateCustomIDMiddleware
};

