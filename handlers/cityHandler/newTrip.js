/**
 * Created by corentin on 28/08/2018.
 */
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const helper = require("../../helpers/helper");

module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  messageData.message = product_data.whichCity;
  return apiMessenger.sendToFacebook(messageData)
    .then(response => {
      delete messageData.message;
      messageData.sender_action = 'typing_on';
      if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
    })
    .then(helper.delayPromise(2000))
    .then(response => {
      delete messageData.sender_action;
      messageData.message = product_data.whichCity2;
      if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
    })
    .catch(err => {
      console.log(err);
    });
};