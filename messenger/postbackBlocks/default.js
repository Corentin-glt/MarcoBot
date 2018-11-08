const MessageData = require("../product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: product_data.defaultPostback
  };
  apiMessenger.sendToFacebook(messageData)
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.log(err);
    });
};