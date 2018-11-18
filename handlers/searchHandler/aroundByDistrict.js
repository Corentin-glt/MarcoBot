/**
 * Created by corentin on 11/06/2018.
 */
const async = require("async");
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const helper = require("../../helpers/helper");
const config = require("../../config");
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const indexLocationQuery = require("../../helpers/graphql/indexLocation/query");
const queryUser = require('../../helpers/graphql/user/query');


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

module.exports = (_district, senderID, locale) => {
  const product_data = new MessageData(locale);
  let dataToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(indexLocationQuery.findByDistrict(_district, 0))
    .then((response) => {
      if(response.findByDistrict !== null && response.findByDistrict.length > 0){
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
          if(err) return sendMessage(senderID,
            {text: "Hmmm... I think the machine's gone crazy! Try again later."}, "RESPONSE");
          return product_data.templateListFromDifferentEvent(newResponses, 0, _district, "mongo")
            .then(result => {
              if (result) {
                dataToSend = Object.assign({}, result);
                return sendMessage(senderID, product_data.selectionDistrictChoice, "RESPONSE")
              }
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
        apiGraphql.sendQuery(queryUser.queryUserByAccountMessenger(senderID))
          .then(res => {
            if (res.userByAccountMessenger) {
              const city = res.userByAccountMessenger.cityTraveling.length > 0 ?
                res.userByAccountMessenger.cityTraveling : "paris";
              return sendMessage(senderID, product_data.jokeMarco2(city), "RESPONSE")
            }
          })
          .catch(err => console.log(err))
      }
    })
    .catch(err => console.log(err))
};
