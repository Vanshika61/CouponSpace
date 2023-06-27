const express = require('express');
const path = require("path");
const app = express();
const bodyparser = require("body-parser");
const port = 8000;

const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/couponSpace');
}


// Define mongoose schema
const contactSchema = new mongoose.Schema({
    name: String,
    phone: String,
    email: String,
    couponName: String,
    details: String,
    expiry: String
});

const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC CONFIGURATION 
app.use('/static', express.static('static'));   // For serving static files
app.use(express.urlencoded());

// PUG SPECIFIC CONFIGURATION 
app.set('view engine', 'pug');      // Set the template engine as pug
app.set('views', path.join(__dirname, 'views'));        // Set the views directory



// ENDPOINTS CONFIGURATION
app.get('/', (req, res) => {
    const params = {}
    res.status(200).render('index', params);
});

app.get('/contact', (req, res) => {
    const params = {}
    res.status(200).render('contact', params);
});

app.post('/contact', (req, res) => {
    var myData = new Contact(req.body);
    myData.save().then(() =>{
        res.send("This item has been save to the database")
    }).catch(() =>{
        res.status(400).send("Item is not saved to the database")
    });
});


// START THE SERVER
app.listen(port, () =>{
    console.log(`The application started successfully on port ${port}`)
});