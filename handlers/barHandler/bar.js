const product_data = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const config = require('../../config');
const ApiGraphql = require("../../helpers/apiGraphql");
const bar = require('../../graphql/bar/query');
const helper = require("../../helpers/helper");
const userMutation = require('../../graphql/user/mutation');

module.exports = (type, price, senderID) => {
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  let dataToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const recommandationApi = new ApiGraphql(config.category[config.indexCategory].recommendationApilUrl, config.accessTokenRecommendationApi);
  messageData.message = product_data.fetchBarsMessage;
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
      if (response.status === 200)
        return recommandationApi.sendQuery(bar.queryBarsByPriceAndType(senderID, type, price, 0));
    })
    .then(res => {
      if (res.barsByPriceAndType.length > 0 && res.barsByPriceAndType !== null ) {
        return product_data.templateList(res.barsByPriceAndType, "BAR", 0,
          "neo4j", type, price)
      } else {
        return product_data.jokeMarco("BAR");
      }
    })
    .then(result => {
      delete messageData.sender_action;
      messageData.message = result;
      return apiMessenger.sendToFacebook(messageData);
    })
    .then(res => {
      if (res.status === 200) {
        messageData.message = product_data.backQuestion("BAR");
        return apiMessenger.sendToFacebook(messageData);
      }
    })
    .then(res => {
      console.log('end bar');
    })
    .catch(err => {
      console.log(err);
      console.log(err.response.data.error);
    });
};
