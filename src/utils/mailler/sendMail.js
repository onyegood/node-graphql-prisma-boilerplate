const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const transporter = nodemailer.createTransport(sendgridTransport({
  auth: {
    api_key: process.env.SEND_GRID_KEY
  }
}));


const sendMail = async (template) => {
  await transporter.sendMail(template);
}

export default sendMail;