const Url = require('../model/Url');

const findShortUrl = async (query) => {
    const document = await Url.findOne({
        shortUrl: query,
    }).exec();
    return document;
};

const get_url = async (shortUrl) => {
    try {
        const myDoc = await findShortUrl(shortUrl);
        const longUrl = myDoc.originalUrl;
        return longUrl;
    } catch (err) {
        console.error(err);
    }
};

const get_all_urls = async () => {
    try {
        const urls = await Url.find();
        return urls;
    } catch (e) {
        console.error(e);
    }
};

module.exports = { get_url, get_all_urls };
