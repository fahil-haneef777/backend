
const nodemailer = require('nodemailer');

const transport = nodemailer.createTransport({
  host: process.env.MAIL_HOST,
  port: process.env.MAIL_PORT,
  secure: false,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

const sendEmail = async ({ userEmail }) => {
  await transport.sendMail({
    from: 'drenched@gmail.com',
    to: userEmail,
    subject: 'Welcome to Our Website',
    text: 'Thank you for registering on our website!',
    html: '<h1>Welcome to our website   </h1>'

  })
}

module.exports = sendEmail;

