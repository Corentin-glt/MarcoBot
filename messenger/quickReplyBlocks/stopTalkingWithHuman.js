const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const helper = require("../../helpers/helper");
const ApiGraphql = require("../../helpers/apiGraphql");
const userMutation = require("../../graphql/user/mutation");
const config = require('../../config')

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
  let dataToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendMutation(userMutation.updateIsTalkingWithHuman(),
  {PSID: senderID, isTalkingToHuman: false})
  .then((response) => {
    if (response.updateIsTalkingWithHuman) {
      const firstName = response.updateIsTalkingWithHuman.firstName;
        return sendMessage(senderID, product_data.stopTalkingWithHuman(firstName), "RESPONSE")
    } else {
      return sendMessage(senderID, product_data.unsubscribeMessageError, "RESPONSE")
    }
  })
  .catch(err => {
    console.log(err)
    return sendMessage(senderID, product_data.unsubscribeMessageError, "RESPONSE")
  });
};
