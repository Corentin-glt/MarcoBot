/**
 * Created by corentin on 23/08/2018.
 */
const product_data = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const ApiGraphql = require("../../helpers/apiGraphql");
const accountMessenger = require('../../graphql/accountMessenger/mutation');
const helper = require("../../helpers/helper");
const config = require('../../config');

module.exports = (senderID) => {
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  apiGraphql.sendMutation(accountMessenger.updateSubAccountMessenger(), {
    PSID: senderID.toString(),
    subscribe: true
  })
    .then(response => {
      if (response.updateSubscription) {
        messageData.message = product_data.subscribeMessage;
        apiMessenger.sendToFacebook(messageData)
          .then(response => {
            console.log('help');
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
      } else {
        messageData.message = product_data.unsubscribeMessageError;
        apiMessenger.sendToFacebook(messageData)
          .then(response => {
            console.log('help');
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
      }
    })
    .catch(err => {
      console.log(err);
    })
};