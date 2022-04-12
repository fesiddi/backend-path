const express = require('express')
const app = express()
const port = 3000
const env = require("dotenv").config()
const bodyParser = require('body-parser');
const dns = require("dns")
const url = require("url")

app.get('/', (req, res) => res.send('Hello World!'))

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

// db connection boiler plate code
const {
    MongoClient,
    ServerApiVersion
} = require('mongodb');
const uri = process.env.DB_URI;
const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1
});

// this post call will write to the db a new url if it's not already present in the db
app.post('/api/shorturl/', async (req, res) => {
    let urlToCheck = req.body.url;
    // TODO: update parse method with WHATWG URL
    parsedURL = url.parse(urlToCheck)
    // check if the url is valid
    TODO:
        // verify that lookup method is working properly
        dns.lookup(parsedURL.protocol ? parsedURL.host :
            parsedURL.path, (err, address, family) => {
                if (err) {
                    console.log(err)
                }
            })
    const finalURL = parsedURL.href
    console.log(finalURL)
    // if (err) { res.json({ error: "Invalid URL" })}
    try {
        // connect to the mongodb client
        await client.connect()
        console.log("Connected Successfully to the server")
        // connect to the db
        const db = client.db("url_db")
        const collection = db.collection("urls")
        let uniqueDoc = await collection.countDocuments({
            "originalURL": finalURL
        })
        let maxUrlValue = await collection.find().sort({
            shortURL: -1
        }).limit(1).toArray()
        const nextUrlValue = maxUrlValue[0]["shortURL"] + 1
        // if uniqueCount is equal to 0 we can create a new entry in the db with the url of the request body
        if (uniqueDoc === 0) {
            docCount++
            const document = {
                originalURL: finalURL,
                shortURL: nextUrlValue
            }
            // Insert a single document, wait for promise so we can read it back
            await collection.insertOne(document);
            // Find one document
            const myDoc = await collection.findOne({
                "shortURL": nextUrlValue
            });
            res.json(myDoc);
            // if the url in the req body is already present we dont write it to the db but we return the object containing it
        } else {
            const myDoc = await collection.findOne({
                "originalURL": finalURL
            });
            res.json(myDoc);
        }
    } catch (err) {
        res.json({
            error: "Invalid URL"
        })
        console.log(err.stack)
    } finally {
        await client.close()
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