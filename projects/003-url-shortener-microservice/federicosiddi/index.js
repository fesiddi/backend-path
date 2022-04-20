const express = require('express')
const app = express()
const port = 3000
const env = require("dotenv").config()
const bodyParser = require('body-parser');
const url = require("url")
const { validate_url, dns_validator } = require("./url_validator")
const { write_to_db } = require("./write_to_db")

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

app.get('/', (req, res) => res.send('Welcome to the URL shortener microservice!'))

// this post call will write to the db a new url if it's not already present in the db
app.post('/api/shorturl/', async (req, res) => {
    let urlToCheck = req.body.url;
    const test = await dns_validator(urlToCheck)
    console.log(test)
    myURL = new url.URL(urlToCheck)
    valid_url = await validate_url(myURL)
    if (!valid_url) {
        res.json({
            error: "Invalid URL"
        })
    }
    if (valid_url) {
        valid_url = (valid_url.href)
        console.log(valid_url)
        try {
            result = await write_to_db(valid_url)
            console.log(result)
            res.json(result)
        } catch (e) {
            console.log(e)
        }
    }
});

// this get call will return a the original url from the short version that is present in the db
app.get('/api/shorturl/:id', async (req, res) => {
    console.log("get called")
    shortUrl = parseInt(req.params.id)
    try {
    async function findShortUrl(query) {
        // connect to the mongodb client
        await client.connect()
        // connect to the db
        const db = client.db("url_db")
        const collection = db.collection("urls")
        const record = await collection.findOne({
            "shortURL": query
        });
        return record
    }
    const myDoc = await findShortUrl(shortUrl)
    const redirectUrl = myDoc.originalURL
    console.log(redirectUrl)
    res.json(myDoc)
} catch (err) {
    res.json({
        error: "Invalid short URL"
    })
} finally {
    await client.close()
}
})

app.listen(port, () => console.log(`Url shortener app listening on port ${port}!`))