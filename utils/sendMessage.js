const client = require("twilio")(
  "AC349bd51967fccf0790f11ca51572f6f8",
  "67d512db22fe55538dffeae97c3d7b7c"
);

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
