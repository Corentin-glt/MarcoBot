const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const helper = require("../../helpers/helper");
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const userMutation = require("../../helpers/graphql/user/mutation");
const config = require('../../config');

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
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendMutation(userMutation.updateIsTalkingWithHuman(),
    {PSID: senderID, isTalkingToHuman: true})
    .then((response) => {
      if (response.updateIsTalkingWithHuman) {
        return sendMessage(senderID, product_data.helpMessage, "RESPONSE")
      }
    })
    .then(() => {
      return sendMessage(senderID, product_data.startTalkingWithHumanHelp, "RESPONSE")
    })
    .catch(err => {
      console.log(err.response.data.error);
    });
};