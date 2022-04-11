const express = require('express')
const app = express()
const port = 3000
const env = require("dotenv").config()
const bodyParser = require('body-parser');
const mongoose = require("mongoose")
const dns = require("dns")

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

app.post('/api/shorturl/', async (req, res) => {
    let { url } = req.body;
    // check if the url is valid
    dns.lookup(url, (err, addresses) => {
        if (err) {console.log(err)}
    })
    url = url.split("://")[1]
    // if (err) { res.json({ error: "Invalid URL" })}
    try { async() => {
        // connect to the mongodb client
        await client.connect()
        console.log("Connected Successfully to the server")
        // connect to the db
        const db = client.db("url_db")
        const collection = db.collection("urls")
        let uniqueDoc = await collection.countDocuments({
            "originalURL": url
        })
        let docCount = await collection.countDocuments()
        // if uniqueCount is equal to 0 we can create a new entry in the db with the url of the request body
        if (uniqueDoc === 0) {
            docCount++
            const document = {
                originalURL: url,
                shortURL: docCount
            }
            // Insert a single document, wait for promise so we can read it back
            const record = await collection.insertOne(document);
            // Find one document
            const myDoc = await collection.findOne({
                "shortURL": docCount
            });
            res.json(myDoc);
        } else {
            const myDoc = await collection.findOne({
                "originalURL": url
            });
            res.json(myDoc);
        }}
    } catch (err) {
        res.json({ error: "Invalid URL" })
        console.log(err.stack)
    } finally {
        await client.close()
    }
    });

app.get('/api/shorturl/:id', async (req, res) => {
    shortUrl = parseInt(req.params.id)
    try {
        async function findShortUrl (query){
            // connect to the mongodb client
            await client.connect()
            // connect to the db
            const db = client.db("url_db")
            const collection = db.collection("urls")
            const record = await collection.findOne({"shortURL": query});
            return record
        }
        const myDoc = await findShortUrl(shortUrl)
        const redirectUrl = myDoc.originalURL
        console.log(redirectUrl)
        res.json(myDoc)
    } catch (err) {
        res.json({error: "Invalid short URL"})
    } finally {
        await client.close()
    }        
    }
)

app.listen(port, () => console.log(`Url shortener app listening on port ${port}!`))