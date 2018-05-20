const product_data = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const helper = require("../../helpers/helper");
module.exports = (senderID) => {
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  messageData.message = product_data.selectionBar;
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
      messageData.message = product_data.selectionBar2;
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
      messageData.message = product_data.selectionBarType;
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