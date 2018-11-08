const MessageData = require("../../../messenger/product_data");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const helper = require("../../../helpers/helper");
const queryUser = require('../../../graphql/user/query');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const config = require('../../../config');

module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };

  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger) {
        const city = res.userByAccountMessenger.cityTraveling.length > 0 ?
          res.userByAccountMessenger.cityTraveling : "paris";
        messageData.message = product_data.selectionDistrict;
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
            messageData.message = product_data.selectionSiteType(city);
            if(resp.status === 200) {
              return apiMessenger.sendToFacebook(messageData)
            }
          })
          // .then(response => {
          //   delete messageData.message;
          //   messageData.sender_action = 'typing_on';
          //   if (response.status === 200)
          //     return apiMessenger.sendToFacebook(messageData);
          // })
          // .then(helper.delayPromise(2000))
          // .then(resp => {
          //   delete messageData.sender_action;
          //   messageData.message = product_data.selectionDistrictType(city, 1);
          //   if(resp.status === 200) {
          //     return apiMessenger.sendToFacebook(messageData)
          //   }
          // })
          .then(() => console.log("end nlp visit"))
          .catch(err => {
            console.log(err.response.data);
          });
      }
    })
    .catch(err => {
      console.log(err.response.data);
    });

};