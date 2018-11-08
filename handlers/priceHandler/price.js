const apiGraphql = require("../../helpers/Api/apiGraphql");
const user = require("../../graphql/user/query");
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const helper = require("../../helpers/helper");
const messengerMethods = require("../../messenger/messengerMethods");

module.exports = (senderID, type, tag, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: product_data.priceMessage(type, tag)
  };
  apiMessenger.sendToFacebook(messageData)
    .then(response => {
      console.log(response.data);
    })
    .catch(err => {
      console.log(err.response.data);
    });
};