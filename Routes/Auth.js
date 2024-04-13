const express = require('express');
const router = express.Router();
const User = require('../Model/User');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const passportConfig = require('../Passport-config/PassportConfig')
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');
const sendEmail = require('../Nodemailer/Nodemailer');
const env = require("dotenv").config();
const nodemailer = require("nodemailer");
const smtptransport = require('nodemailer-smtp-transport')
const transporter = nodemailer.createTransport({
  service: "Gmail",
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: "fahilhaneef006@gmail.com",
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify(function (error, success) {
  if (error) {
    console.log(error);
  } else {
    console.log("Server is ready to take our messages");
  }
});

async function main() {
  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Maddison Foo Koch 👻" <fahilhaneef006@gmail.com>', // sender address
    to: "elliott6518@gmail.com", // list of receivers
    subject: "Hello ✔", // Subject line
    text: "Hello world?", // plain text body
    html: "<b>Hello world?</b>", // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <d786aa62-4e0a-070a-47ed-0b0666549519@ethereal.email>
}


router.post('/register',
  // Validate inputs
  body('name').notEmpty().trim().escape(),
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { name, email, password } = req.body;
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        return res.status(403).json({ error: 'User already exists' });
      }
      const hashedPassword = await bcrypt.hash(password, 10);


      const user = new User({ name, email, password: hashedPassword });
      await user.save();
      main().catch(console.error);
      res.status(200).send({ message: 'User registered successfully' });
    } catch (error) {
      console.error('Error in registration:', error);
      res.status(500).send({ error: 'An error occurred during registration' });
    }
  });

// Login route with form validation middleware
router.post('/login',
  // Validate inputs
  body('email').isEmail().normalizeEmail(),
  body('password').isLength({ min: 6 }),
  async (req, res) => {
    try {
      // Check for validation errors
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      const { email, password } = req.body;

      // Find user by email
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).send({ error: 'Invalid email or password' });
      }

      // Compare password
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).send({ error: 'Incorrect password' });
      }

      // Generate token
      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY);

      res.send({ token, name: user.name });
    } catch (error) {
      console.error('Error in login:', error);
      res.status(500).json({ error: 'Server error' });
    }
  });

module.exports = router;