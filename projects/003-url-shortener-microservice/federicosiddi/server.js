const env = require('dotenv').config();
const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const mongoose = require('mongoose');
const connectDB = require('./config/dbConn');
const { get_all_urls } = require('./controllers/get_url');

//Connect to mongoDB
connectDB();

app.use(express.json());
app.use(
    express.urlencoded({
        extended: false,
    })
);

app.set('view engine', 'ejs');

app.get('/', async (req, res) => {
    urls = await get_all_urls();
    res.render('index', { urls: urls });
});

app.use('/api', require('./routes/api'));

mongoose.connection.once('open', () => {
    console.log('Connected to DB');
    app.listen(PORT, () =>
        console.log(`Url shortener app listening on port ${PORT}!`)
    );
});
