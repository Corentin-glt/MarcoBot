/**
 * Created by corentin on 13/06/2018.
 */
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const ApiGraphql = require("../../helpers/apiGraphql");
const restaurant = require('../../graphql/restaurant/query');
const bar = require('../../graphql/bar/query');
const config = require('../../config');
module.exports = (type, price, params, senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  const tempParams = params.split(":");
  const event = tempParams[0].toLowerCase();
  const page = tempParams[1];
  const queryType = event === 'restaurant' ? restaurant.queryRestaurantsByPriceAndType(senderID, type, price, page) : bar.queryBarsByPriceAndType(senderID, type, price, page);
  const recommandationApi = new ApiGraphql(config.category[config.indexCategory].recommendationApilUrl, config.accessTokenRecommendationApi);
  const conditionType = event === 'restaurant' ? 'restaurantsByPriceAndType' : 'barsByPriceAndType';

  recommandationApi.sendQuery(queryType)
   .then(res => {
    if (res[conditionType].length > 0 && res[conditionType] !== null) {
      return product_data.templateList(res[conditionType],
        tempParams[0], page, "neo4j", type, price)
    } else {
      return product_data.jokeMarco(tempParams[0]);
    }
  })
    .then(result => {
      delete messageData.sender_action;
      messageData.message = result;
      return apiMessenger.sendToFacebook(messageData);
    })
    .then(res => {
      console.log(type);
      messageData.message = product_data.backQuestion(tempParams[0]);
      return apiMessenger.sendToFacebook(messageData);
    })
    .then(res => {
      console.log('end recommendation');
    })
    .catch(err => {
      console.log(err.response.data.error);
    });
};