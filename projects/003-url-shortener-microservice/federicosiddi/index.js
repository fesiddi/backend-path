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


app.post('/api/shorturl/', (req, res) => {
    let {
        url,
    } = req.body;
    url = url.split("://")[1]
    // check if the url is valid
    dns.lookup(url, async (err, addresses) => {
        if (err) {
            res.json({
                error: "Invalid URL"
            })
        }
        try {
            // connect to the mongodb client
            await client.connect()
            console.log("Connected Successfully to the server")
            // connect to the db
            const db = client.db("url_db")
            const collection = db.collection("urls")
            const document = {
                originalURL: url,
            }
            // Insert a single document, wait for promise so we can read it back
            const p = await collection.insertOne(document);
            // Find one document
            const myDoc = await collection.findOne();
            // Print to the console
            console.log(myDoc);
        } catch (err) {
            console.log(err.stack)
        } finally {
            await client.close()
        }
    })
});

app.get('/api/shorturl/:id', (req, res) => {
    shortUrlId = req.params.id
    res.redirect()

})

app.listen(port, () => console.log(`Url shortener app listening on port ${port}!`))