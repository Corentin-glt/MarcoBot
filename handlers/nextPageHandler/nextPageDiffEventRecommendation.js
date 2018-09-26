/**
 * Created by corentin on 13/06/2018.
 */
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const ApiGraphql = require("../../helpers/apiGraphql");
const visit = require('../../graphql/visit/query');
const config = require('../../config');
const queryUser = require('../../graphql/user/query');

module.exports = (params, senderID) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  console.log(params);
  const tempParam = params.split(':');
  const type = tempParam[0];
  const page = tempParam[1];
  const recommandationApi = new ApiGraphql(
    config.category[config.indexCategory].recommendationApilUrl,
    config.accessTokenRecommendationApi);
  recommandationApi.sendQuery(
    visit.queryVisitsByPriceAndType(senderID, type, page))
    .then(res => {
      if (res.visitsByPriceAndType.length > 0 && res.visitsByPriceAndType !==
        null) {
        product_data.templateListFromDifferentEvent(
          res.visitsByPriceAndType, page, '', "neo4j", type)
          .then(result => {
            delete messageData.sender_action;
            messageData.message = result;
            return apiMessenger.sendToFacebook(messageData);
          })
          .then(res => {
            console.log(type);
            messageData.message = product_data.backQuestion("VISIT");
            return apiMessenger.sendToFacebook(messageData);
          })
          .then(res => {
            console.log('next event recommendation');
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
      } else {
        const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
        apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
          .then(res => {
            if (res.userByAccountMessenger) {
              const city = res.userByAccountMessenger.cityTraveling.length > 0 ?
                res.userByAccountMessenger.cityTraveling : "paris";
              return product_data.jokeMarco("VISIT", city);
            }
          })
          .then(result => {
            delete messageData.sender_action;
            messageData.message = result;
            return apiMessenger.sendToFacebook(messageData);
          })
          .then(res => {
            console.log(type);
            messageData.message = product_data.backQuestion("VISIT");
            return apiMessenger.sendToFacebook(messageData);
          })
          .then(res => {
            console.log('next event recommendation');
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
      }
    })
    .catch(err => {
      console.log(err.response.data.error);
    });

};
