const { default: mongoose } = require('mongoose');
const Url = require('../model/Url');

const post_url = async (inputUrl) => {
    console.log('inputUrl: ', inputUrl);
    try {
        // search in DB for a document with inputUrl as the originalUrl,
        let uniqueDoc = await Url.countDocuments({
            originalUrl: inputUrl,
        }).exec();
        // search for max value of shortUrl stored in DB
        let maxUrlValue = await Url.find()
            .sort({
                shortUrl: -1,
            })
            .limit(1)
            .exec();
        // if maxUrlValue array is empty, the DB is empty
        if (maxUrlValue.length == 0) {
            maxUrlValue = 0;
        }
        // nextUrlValue will be the value for shortUrl that will be stored in the new record
        let nextUrlValue;
        if (maxUrlValue != 0) {
            nextUrlValue = maxUrlValue[0]['shortUrl'] + 1;
        } else {
            nextUrlValue = 1;
        }
        // if uniqueCount is equal to 0 we can create a new entry in the db with the inputUrl
        if (uniqueDoc == 0) {
            const document = new Url({
                _id: new mongoose.Types.ObjectId(),
                originalUrl: inputUrl,
                shortUrl: nextUrlValue,
            });
            await document.validate();
            // Insert a single document
            document.save((err) => {
                if (err) {
                    console.error(err);
                }
            });
            return document.toObject();
        } else {
            // if uniqueDoc is not 0 the inputUrl is already present in the DB, we return the object containing it
            const dbDoc = await Url.findOne({
                originalUrl: inputUrl,
            }).exec();
            console.log('dbDoc: ', dbDoc);
            return dbDoc;
        }
    } catch (err) {
        console.log(err.stack);
    }
};

module.exports = post_url;
