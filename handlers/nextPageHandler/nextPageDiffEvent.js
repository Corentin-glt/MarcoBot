/**
 * Created by corentin on 13/06/2018.
 */
const async = require("async");
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const helper = require("../../helpers/helper");
const config = require("../../config");
const ApiGraphql = require("../../helpers/apiGraphql");
const indexLocationQuery = require("../../graphql/indexLocation/query");
const queryUser = require('../../graphql/user/query');


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

module.exports = (payload, senderID, locale) => {
  const product_data = new MessageData(locale);
  const newPayload = payload.split(':');
  const _district = newPayload[0];
  const page = newPayload[1];
  let dataToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(indexLocationQuery.findByDistrict(_district, page))
    .then((response) => {
      if (response.findByDistrict !== null && response.findByDistrict.length > 0) {
        let responses = [...response.findByDistrict];
        let newResponses = [];
        async.each(responses, (elem, callback) => {
          elem.kindElement = "";
          for (const propertyName in elem) {
            if (propertyName !== "id" && propertyName !== "users_id"
              && propertyName !== "lastClick" && propertyName !== "dateClick" && elem[propertyName] !== null) {
              elem[propertyName].kindElement = propertyName.slice(0, propertyName.indexOf("s_")).toUpperCase();
              if (elem[propertyName].kindElement === "ACTIVITIE") elem[propertyName].kindElement = "ACTIVITY";
              newResponses.push(elem[propertyName]);
              return callback();
            }
          }
        }, (err) => {
          if (err) return sendMessage(senderID,
            {text: "Hmmm... I think the machine's gone crazy! Try again later."}, "RESPONSE");
          return product_data.templateListFromDifferentEvent(newResponses, page, _district, "mongo")
            .then(result => {
              if (result) {
                dataToSend = Object.assign({}, result);
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderID},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
              }
            })
            .then(helper.delayPromise(2000))
            .then((response) => {
              if (response.status === 200)
                return sendMessage(senderID, dataToSend, "RESPONSE")
            })
            .then((response) => {
              if (response.status === 200)
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderID},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
            })
            .then(helper.delayPromise(2000))
            .then((response) => {
              if (response.status === 200)
                return sendMessage(senderID, product_data.question1MessageAfterDistrict, "RESPONSE")
            })
        })
      } else {
        return apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID));
      }
    })
    .then(res => {
      if (res.userByAccountMessenger) {
        const city = res.userByAccountMessenger.cityTraveling.length > 0 ?
          res.userByAccountMessenger.cityTraveling : "paris";
        return sendMessage(senderID, product_data.jokeMarco2(city), "RESPONSE")
      }
    })
    .catch(err => console.log(err))
};
