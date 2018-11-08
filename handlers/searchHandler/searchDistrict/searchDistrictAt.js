/**
 * Created by corentin on 12/06/2018.
 */
const MessageData = require("../../../messenger/product_data");
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const helper = require("../../../helpers/helper");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const queryUser = require('../../../graphql/user/query');
const config = require('../../../config');

module.exports = (senderID, page, locale) => {
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
        messageData.sender_action = 'typing_on';
        return apiMessenger.sendToFacebook(messageData)
          .then(helper.delayPromise(2000))
          .then(resp => {
            delete messageData.sender_action;
            messageData.message = product_data.selectionDistrictType(city, page);
            if (resp.status === 200) {
              return apiMessenger.sendToFacebook(messageData)
            }
          })
          .catch(err => {
            console.log(err.response.data);
          });
      }
    })
    .catch(err => {
      console.log(err.response.data);
    });

};