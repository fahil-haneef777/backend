const express = require('express');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs')
const mongoose = require('mongoose');
const session = require('express-session');
const app = express();
const env = require("dotenv").config();
const User = require('./Model/User')
const authRoute = require('./Routes/Auth');
const passportConfig = require('./Passport-config/PassportConfig')

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(session({
  secret: 'your-secret-key', // Replace with a secure secret key
  resave: false,
  saveUninitialized: false
}));
app.use(passportConfig.initialize());
app.use(passportConfig.session());


app.get('/', (req, res) => {
  res.status(200).send('all good')
})

app.use(authRoute)

app.listen(3000, () => {
  mongoose
    .connect(process.env.MONGODB_URL)
    .then(() => {
      console.log("Server running successfully and connected to db");
    })
    .catch((error) => console.log(error));
})