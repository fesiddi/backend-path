const express = require('express');
const router = express.Router();
const { dns_validator, validate_url } = require('../controllers/url_validator');
const url = require('url');
const post_url = require('../controllers/post_url');
const { get_url } = require('../controllers/get_url');
const { delete_url } = require('../controllers/delete_url');

// this get call will return a the original url from the short version that is present in the db
router.get('/shorturl/:id', async (req, res) => {
    try {
        let shortUrl = parseInt(req.params.id);
        let originalUrl = await get_url(shortUrl);
        res.json({ 'Original Url': originalUrl });
    } catch (err) {
        console.error(err);
    }
});

// this post call will write to the db a new url if it's not already present in the db
router.post('/shorturl/', async (req, res) => {
    let urlToCheck = req.body.originalUrl;
    let myURL = new url.URL(urlToCheck);
    const test = dns_validator(myURL);
    let valid_url = await validate_url(test);
    if (!valid_url) {
        return res.redirect('/api/error');
    }
    if (valid_url) {
        valid_url = valid_url.href;
        try {
            result = await post_url(valid_url);
            return res.redirect('/');
        } catch (e) {
            console.log(e);
        }
    }
});

router.delete('/shorturl/delete/:id', async (req, res) => {
    console.log('delete: ', req.params.id);
    urlToDelete = parseInt(req.params.id);
    await delete_url(urlToDelete);
    return res.redirect('/');
});

router.get('/error', (req, res) => {
    res.render('error');
});

module.exports = router;
