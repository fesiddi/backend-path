const mongoose = require('mongoose');
const { Schema } = mongoose;

const urlSchema = new Schema({
    originalUrl: {
        type: String,
        required: true,
    },
    shortUrl: {
        type: Number,
        required: true,
    },
});

const Url = mongoose.model('Url', urlSchema);

module.exports = Url;
