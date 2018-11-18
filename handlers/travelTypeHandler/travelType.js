
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const helper = require("../../helpers/helper");
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const config = require('../../config');
const userMutation = require("../../helpers/graphql/user/mutation");
module.exports = (senderID, travelType, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  const user = {
    PSID: senderID,
    travelType: travelType
  };
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  apiGraphql.sendMutation(userMutation.updateUserByAccountMessenger(), user)
    .then(response => {
      if(response.updateUserByAccountMessenger !== null) {
        messageData.message = product_data.letsGoMessage;
        return apiMessenger.sendToFacebook(messageData)
      }
    })
    .then(response => {
      delete messageData.message;
      messageData.sender_action = 'typing_on';
      if (response.status === 200)
        return apiMessenger.sendToFacebook(messageData);
    })
    .then(helper.delayPromise(1000))
    .then(response => {
      if(response.status === 200) {
        delete messageData.sender_action;
        messageData.message = product_data.question1Message;
        return apiMessenger.sendToFacebook(messageData)
      }
    })
    .then(resp => {
      console.log('end of traveltype');
    })
    .catch(err => {
      console.log(err);
    });
};