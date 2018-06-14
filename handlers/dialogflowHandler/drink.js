/**
 * Created by corentin on 14/06/2018.
 */
const queryBar = require('../../graphql/bar/query');
const product_data = require("../../messenger/product_data");
const config = require("../../config");
const ApiGraphql = require('../../helpers/apiGraphql');
const helper = require("../../helpers/helper");
const apiMessenger = require('../../helpers/apiMessenger');

const sendMessage = (senderId, data, typeMessage) => {
  return new Promise((resolve, reject) => {
    const objectToSend = {
      recipient: {id: senderId},
      messaging_types: typeMessage,
      message: data
    };
    apiMessenger.sendToFacebook(objectToSend)
      .then((res) => resolve(res))
      .catch(err => reject(err));
  });
};

module.exports = (parameters,senderId) => {
  let dataToSend = {};
  console.log("PARAMETERS ==> " , parameters);
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  if (typeof parameters.drink !== "undefined" && parameters.drink !== null
    && parameters.drink.length > 0 && parameters.drink[0] !== 'drink' && parameters.drink.length > 0){
    return sendMessage(senderId, product_data.priceMessage('BAR', parameters.drink[0]), "RESPONSE")
  } else {
    return apiGraphql.sendQuery(queryBar.queryBars(0))
      .then((res) => {
        return product_data.templateList(res.bars, "BAR", 0, "mongo")
      })
      .then(result => {
        dataToSend = Object.assign({}, result);
        return sendMessage(senderId, {text: response.result.fulfillment.speech}, "RESPONSE")
      })
      .then((response) => {
        if (response.status === 200)
          return apiMessenger.sendToFacebook({
            recipient: {id: senderId},
            sender_action: 'typing_on',
            messaging_types: "RESPONSE",
            message: ""
          })
      })
      .then((response) => {
        if (response.status === 200)
          return sendMessage(senderId, dataToSend, "RESPONSE")
      })
      .then((response) => {
        if (response.status === 200)
          return apiMessenger.sendToFacebook({
            recipient: {id: senderId},
            sender_action: 'typing_on',
            messaging_types: "RESPONSE",
            message: ""
          })
      })
      .then(helper.delayPromise(2000))
      .then(() => {
        return sendMessage(senderId, product_data.question1MessageListView, "RESPONSE")
      })
      .catch(err => {
        console.log(err);
      });
  }
};