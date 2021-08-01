const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");

const sendEmail = async (options) => {
  const transporter = nodemailer.createTransport(
    nodemailerSendgrid({
      apiKey: `${process.env.SENDGRID_API_KEY}`,
    })
  );

  let message = {
    from: `${process.env.FROM_NAME}<${process.env.FROM_EMAIL}`,
    to: options.email,
    subject: options.subject,
    text: options.message,
  };

  const info = await transporter.sendMail(message);

  console.log("Message sent: %s", info.messageId);
};

module.exports = sendEmail;
