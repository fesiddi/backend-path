const Url = require('../model/Url');

const delete_url = async (urlToDelete) => {
    try {
        document = await Url.deleteOne({ shortUrl: urlToDelete }).exec();
        return true;
    } catch (e) {
        console.error(e);
        return false;
    }
};

module.exports = {
    delete_url,
};
