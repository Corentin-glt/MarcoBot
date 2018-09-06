/**
 * Created by corentin on 21/08/2018.
 */
const queryProgram = require('../../graphql/program/query');
const queryItinerary = require('../../graphql/itinerary/query');
const MessageData = require("../../messenger/product_data");
const config = require("../../config");
const ApiGraphql = require('../../helpers/apiGraphql');
const helper = require("../../helpers/helper");
const apiMessenger = require('../../helpers/apiMessenger');
const async = require("async");

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

module.exports = (parameters, senderId, locale) => {
  const product_data = new MessageData(locale);
  const paramatersArray = parameters.split(':');
  const idProgram = paramatersArray[0];
  const numberDay = parseInt(paramatersArray[1]);
  const page = parseInt(paramatersArray[2]);
  let dataToSend = {};
  let itineraryToSend = {};
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(queryItinerary.getItineraries(idProgram, numberDay))
    .then(itineraries => {
      async.each(itineraries.getItineraries, (itinerary, callback) => {
        if (itinerary.order === page)
          itineraryToSend = itinerary;
        callback();
      }, (err) => {
        if (err) console.log(err);
        if (Object.keys(itineraryToSend).length !== 0) {
          return apiMessenger.sendToFacebook({
            recipient: {id: senderId},
            sender_action: 'typing_on',
            messaging_types: "RESPONSE",
            message: ""
          })
            .then(helper.delayPromise(2000))
            .then(res => {
              return sendMessage(senderId,
                product_data.itineraryNotifications(`${itineraryToSend.description}`, numberDay, page, idProgram), "RESPONSE")
            })
            .catch(err => console.log(err.response.data))
        } else {
          return apiGraphql.sendQuery(queryProgram.getProgramById(idProgram))
            .then(program => {
              if (program.getProgramById) {
                const programToSend = program.getProgramById;
                return apiMessenger.sendToFacebook({
                  recipient: {id: senderId},
                  sender_action: 'typing_on',
                  messaging_types: "RESPONSE",
                  message: ""
                })
                  .then(helper.delayPromise(2000))
                  .then(res => {
                    return sendMessage(senderId,product_data.textBeforeShare(programToSend.url_articles[numberDay - 1]), "RESPONSE")
                      .then(response => {
                        if(response.status === 200)
                          return sendMessage(senderId,
                            product_data.shareOrFindUrlMedium, "RESPONSE")
                      })
                  })
              }
            })
            .catch(err => console.log(err.response.data.error))
        }
      })
    })
    .catch(err => console.log(err))
}