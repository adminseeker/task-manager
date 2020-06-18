const nodemailer = require("nodemailer");

var transporter =nodemailer.createTransport({
    service: "gmail",                           // Email Service
    auth: {
      user: process.env.login_email,            //Enter your login mail
      pass: process.env.login_password          //Enter your login password
    }
  });
  
  var mailOptions = {
    from: process.env.login_email,               //Enter your login mail
    to: "",
    subject: "Task Manager",
    text: ''
  };

  const mailer = async (text,toEmail)=>{
    mailOptions.to=toEmail;
    mailOptions.text=text;
    await transporter.sendMail(mailOptions);
  }

  module.exports = mailer;
