const MessageData = require("../../messenger/product_data");
const userQuery = require("../../graphql/user/query");
const config = require("../../config");
const apiMessenger = require("../../helpers/apiMessenger");
const helper = require("../../helpers/helper");
const ApiGraphql = require("../../helpers/apiGraphql");

module.exports = (senderID, locale) => {
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  const product_data = new MessageData(locale);
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger) {
        messageData.message = product_data.selectionSite;
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
            messageData.message = product_data.selectionSite2;
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
            console.log(res.userByAccountMessenger.cityTraveling);
            messageData.message = product_data.selectionSiteType(res.userByAccountMessenger.cityTraveling);
            if(resp.status === 200) {
              return apiMessenger.sendToFacebook(messageData)
            }
          })
          .then(resp => {
            console.log("end visit");
          })
          .catch(err => {
            console.log(err);
          });
      }
    })
    .catch(err => {
      console.log(err);
    })

};
