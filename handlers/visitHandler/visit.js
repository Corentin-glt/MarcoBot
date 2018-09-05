const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const ApiGraphql = require("../../helpers/apiGraphql");
const visit = require('../../graphql/visit/query');
const helper = require("../../helpers/helper");
const userMutation = require('../../graphql/user/mutation');
const config = require('../../config');

module.exports = (type, senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  let dataToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const recommandationApi = new ApiGraphql(config.category[config.indexCategory].recommendationApilUrl, config.accessTokenRecommendationApi);
  messageData.message = product_data.fetchVisitsMessage;
  apiMessenger.sendToFacebook(messageData)
    .then(response => {
      if (response.status === 200)
        return apiGraphql.sendMutation(userMutation.addCategoryByAccountMessenger(), {
          PSID: senderID.toString(),
          category: type
        });
    })
    .then(response => {
      delete messageData.message;
      messageData.sender_action = 'typing_on';
      return apiMessenger.sendToFacebook(messageData);
    })
    .then(helper.delayPromise(1000))
    .then(response => {
      console.log(visit.queryVisitsByPriceAndType(senderID, type, 0));
      if (response.status === 200)
        return recommandationApi.sendQuery(visit.queryVisitsByPriceAndType(senderID, type, 0));
    })
    .then(res => {
      console.log(res);
      if (res.visitsByPriceAndType.length > 0 && res.visitsByPriceAndType !== null) {
        return product_data.templateListFromDifferentEvent(
          res.visitsByPriceAndType, 0, '', "neo4j", type);
      } else {
        return product_data.jokeMarco("VISIT");
      }
    })
    .then(result => {
      console.log(result);
      delete messageData.sender_action;
      messageData.message = result;
      return apiMessenger.sendToFacebook(messageData);
    })
    .then(res => {
      if (res.status === 200) {
        messageData.message = product_data.backQuestion("VISIT");
        return apiMessenger.sendToFacebook(messageData);
      }
    })
    .then(() => {
      console.log('end visit');
    })
    .catch(err => {
      console.log(err);
      console.log(err.response.data.error);
    });
};