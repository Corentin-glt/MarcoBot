const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const ApiGraphql = require("../../helpers/apiGraphql");
const restaurant = require('../../graphql/restaurant/query');
const helper = require("../../helpers/helper");
const userMutation = require('../../graphql/user/mutation');
const config = require('../../config');
const queryUser = require('../../graphql/user/query');


module.exports = (type, price, senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  messageData.message = product_data.fetchRestaurantsMessage;
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const recommandationApi = new ApiGraphql(config.category[config.indexCategory].recommendationApilUrl, config.accessTokenRecommendationApi);
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
        return recommandationApi.sendQuery(restaurant.queryRestaurantsByPriceAndType(senderID, type, price, 0));
    })
    .then(res => {
      if (res.restaurantsByPriceAndType.length > 0 && res.restaurantsByPriceAndType !== null) {
        product_data.templateList(res.restaurantsByPriceAndType,
          "RESTAURANT", 0, "neo4j", type, price)
          .then(result => {
            delete messageData.sender_action;
            messageData.message = result;
            return apiMessenger.sendToFacebook(messageData);
          })
          .then(res => {
            if (res.status === 200) {
              messageData.message = product_data.backQuestion("RESTAURANT");
              return apiMessenger.sendToFacebook(messageData);
            }
          })
          .then(res => {
            console.log('end restaurant');
          })
          .catch(err => {
            console.log(err.response.data.error);
          });
      } else {
        apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
          .then(res => {
            if (res.userByAccountMessenger) {
              const city = res.userByAccountMessenger.cityTraveling.length > 0 ?
                res.userByAccountMessenger.cityTraveling : "paris";
              return product_data.jokeMarco("RESTAURANT", city);
            }
          })
          .then(result => {
            delete messageData.sender_action;
            messageData.message = result;
            return apiMessenger.sendToFacebook(messageData);
          })
          .then(res => {
            if (res.status === 200) {
              messageData.message = product_data.backQuestion("RESTAURANT");
              return apiMessenger.sendToFacebook(messageData);
            }
          })
          .then(res => {
            console.log('end restaurant');
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