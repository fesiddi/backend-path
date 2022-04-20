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

async function write_to_db(finalURL) {
    console.log(finalURL)
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
            return (myDoc);
            // if the url in the req body is already present we dont write it to the db but we return the object containing it
        } else {
            const myDoc = await collection.findOne({
                "originalURL": finalURL
            });
            return (myDoc);
        }
    } catch (err) {
        return ({
            error: "Invalid URL"
        })
        console.log(err.stack)
    } finally {
        await client.close()
    }
}


module.exports = {
    write_to_db
}