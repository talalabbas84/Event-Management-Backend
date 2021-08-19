const client = require("twilio")();

const sendMessage = async (options) => {
  client.messages
    .create({
      body: options.message,
      from: 888,
      to: options.phoneNo,
    })
    .then((message) => console.log(message.sid))
    .catch((err) => console.log(err));
  //   console.log("Message sent: %s", info.messageId);
};

module.exports = sendMessage;
