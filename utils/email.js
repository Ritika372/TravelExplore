const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  //1.) create transporter
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  //2.)define email options
  const mailOptions = {
    from: 'Ritika Goyal <ritika@gmail.com>',
    to: options.email,
    subject: options.subject,
    text: options.message,
    //html
  };

  //3.) activate send the email
  await transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
