const env = require("dotenv").config()
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

async function get_url() {
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
}

module.exports = {
    get_url
}