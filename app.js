const express = require('express');
const path = require('path');
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const pug = require('pug');
const port = 8000;

const mongoose = require('mongoose');

main().catch((err) => console.log(err));

async function main() {
  await mongoose.connect('mongodb://127.0.0.1:27017/couponSpace');
}

// Define mongoose schema
const contactSchema = new mongoose.Schema({
  name: String,
  phone: Number,
  email: String,
  couponName: String,
  details: String,
  expiry: Date
});

const Contact = mongoose.model('Contact', contactSchema);

// EXPRESS SPECIFIC CONFIGURATION
app.use('/static', express.static('static')); // For serving static files
app.use(bodyParser.urlencoded({ extended: true }));

// PUG SPECIFIC CONFIGURATION
app.set('view engine', 'pug'); // Set the template engine as pug
app.set('views', path.join(__dirname, 'views')); // Set the views directory

// ENDPOINTS CONFIGURATION
app.get('/', async (req, res) => {
  try {
    const data = await Contact.find({}).exec();
    res.render('index', { data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

app.get('/contact', (req, res) => {
  const params = {};
  res.status(200).render('contact', params);
});

app.post('/contact', (req, res) => {
  var params = { alert: 'Success, details have been submitted successfully...' };
  var myData = new Contact(req.body);
  myData
    .save()
    .then(() => {
      res.status(200).render('contact', params);
    })
    .catch((error) => {
      params = { alert: 'Something went wrong, please try again...' };
      res.status(400).render('contact', params);
    });
});

app.get('/api/data', (req, res) => {
  Contact.find({})
    .exec()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).send('Internal Server Error');
    });
});

app.get('/', async (req, res) => {
  try {
    const data = await Contact.find({}).exec();
    res.render('index', { data });
  } catch (err) {
    console.error(err);
    res.status(500).send('Internal Server Error');
  }
});

// START THE SERVER
app.listen(port, () => {
  console.log(`The application started successfully on port ${port}`);
});
