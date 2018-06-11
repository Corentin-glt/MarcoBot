
const product_data = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const helper = require("../../helpers/helper");
const ApiGraphql = require("../../helpers/apiGraphql");
const config = require('../../config');
const userMutation = require("../../graphql/user/mutation");
module.exports = (senderID, travelType) => {
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