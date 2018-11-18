/**
 * Created by corentin on 14/06/2018.
 */
const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const laterQuery = require("../../helpers/graphql/later/query");
const userQuery = require("../../helpers/graphql/user/query");
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const helper = require("../../helpers/helper");
const config = require("../../config");
const async = require('async');

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

module.exports = (page, senderID, locale) => {
  const product_data = new MessageData(locale);
  let dataToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if (res.userByAccountMessenger) {
        return apiGraphql.sendQuery(laterQuery.queryLaters(res.userByAccountMessenger.id, page))
      }
    })
    .then(res => {
      if (res.laters !== null && res.laters.length > 0) {
        let responses = [...res.laters];
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
          return product_data.templateLaterView(newResponses, page)
            .then(results => {
              dataToSend = Object.assign({}, results);
              return apiMessenger.sendToFacebook({
                recipient: {id: senderID},
                sender_action: 'typing_on',
                messaging_types: "RESPONSE",
                message: ""
              })
            })
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
            .then(() => {
              return sendMessage(senderID, product_data.question1MessageListView, "RESPONSE")
            })
            .catch(err => {
              console.log(err);
            });
        });
      } else {
        return sendMessage(senderID, product_data.nothingMore, "RESPONSE")
      }
    })
    .catch(err => {
      console.log(err);
    });

};