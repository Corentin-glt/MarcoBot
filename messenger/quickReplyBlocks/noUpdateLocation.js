/**
 * Created by corentin on 18/05/2018.
 */
const apiMessenger = require("../../helpers/apiMessenger");
const MessageData = require("../../messenger/product_data");
const helper = require("../../helpers/helper");

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

module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  return apiMessenger.sendToFacebook({
    recipient: {id: senderID},
    sender_action: 'typing_on',
    messaging_types: "RESPONSE",
    message: ""
  })
    .then(helper.delayPromise(2000))
    .then(response => {
      if (response.status === 200)
        return sendMessage(senderID, product_data.question1MessageAfterLocation, "RESPONSE")
    })
};