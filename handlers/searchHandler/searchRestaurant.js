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
  messageData.message = product_data.selectionRestaurant;
  apiMessenger.sendToFacebook(messageData)
    .then(response => {
      delete messageData.message;
      messageData.sender_action = 'typing_on';
      if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
    })
    .then(helper.delayPromise(2000))
    .then(resp => {
      delete messageData.sender_action;
      messageData.message = product_data.selectionRestaurant2;
      if(resp.status === 200) {
        return apiMessenger.sendToFacebook(messageData)
      }
    })
    .then(response => {
      delete messageData.message;
      messageData.sender_action = 'typing_on';
      if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
    })
    .then(helper.delayPromise(2000))
    .then(resp => {
      delete messageData.sender_action;
      messageData.message = product_data.selectionRestaurantType;
      if(resp.status === 200) {
        return apiMessenger.sendToFacebook(messageData)
      }
    })
    .then(resp => {
      console.log(resp);
    })
    .catch(err => {
      console.log(err);
    });
};