/**
 * Created by corentin on 08/10/2018.
 */
const MessageData = require("../../messenger/product_data");
const config = require("../../config");
const helper = require("../../helpers/helper");
const apiMessenger = require('../../helpers/Api/apiMessenger');

const sendMessage = (senderId, data, typeMessage) => {
  return new Promise((resolve, reject) => {
    const objectToSend = {
      recipient: {id: senderId},
      messaging_types: typeMessage,
      message: data
    };
    apiMessenger.sendToFacebook(objectToSend)
      .then((res) => resolve(res))
      .catch(err => reject(err));
  });
};

module.exports = (senderId, locale) => {
  const product_data = new MessageData(locale);
  return apiMessenger.sendToFacebook({
    recipient: {id: senderId},
    sender_action: 'typing_on',
    messaging_types: "RESPONSE",
    message: ""
  })
    .then(helper.delayPromise(2000))
    .then(res => {
      return sendMessage(senderId,
        product_data.seeMenuTransition, "RESPONSE")
    })
    .catch(err => console.log(err));
};