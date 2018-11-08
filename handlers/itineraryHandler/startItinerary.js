/**
 * Created by corentin on 21/08/2018.
 */
const queryProgram = require('../../graphql/program/query');
const queryItinerary = require('../../graphql/itinerary/query');
const mutationTrip = require('../../graphql/trip/mutation');
const MessageData = require("../../messenger/product_data");
const config = require("../../config");
const ApiGraphql = require('../../helpers/apiGraphql');
const helper = require("../../helpers/helper");
const apiMessenger = require('../../helpers/apiMessenger');
const async = require("async");
const axios = require("axios");

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
  let dataToSend = {};
  let itineraryToSend = {};
  const apiGraphql = new ApiGraphql(
    config.category[config.indexCategory].apiGraphQlUrl,
    config.accessTokenMarcoApi);
  return apiGraphql.sendMutation(mutationTrip.updateTripByProgramId(),
    {PSID: senderId, programId: idProgram})
    .then(response => {
      console.log(response);
      apiGraphql.sendQuery(queryItinerary.getItineraries(idProgram, numberDay))
        .then(itineraries => {
          async.each(itineraries.getItineraries, (itinerary, callback) => {
            if (itinerary.order === 1)
              itineraryToSend = itinerary;
            callback();
          }, (err) => {
            if (err) console.log(err);
            return apiMessenger.sendToFacebook({
              recipient: {id: senderId},
              sender_action: 'typing_on',
              messaging_types: "RESPONSE",
              message: ""
            })
              .then(helper.delayPromise(2000))
              .then(res => {
                return sendMessage(senderId,
                  product_data.sendPhotoItinerary(itineraryToSend.photo),
                  "RESPONSE")
              })
              .then(res => {
                if (res.status === 200) {
                  return apiMessenger.sendToFacebook({
                    recipient: {id: senderId},
                    sender_action: 'typing_on',
                    messaging_types: "RESPONSE",
                    message: ""
                  });
                }
              })
              .then(helper.delayPromise(2000))
              .then(res => {
                let locationsGoogleMap = itineraryToSend.locations.length > 1 ?
                  'dir' : 'place';
                async.each(itineraryToSend.locations, (location, callback) => {
                  const nameOfLocation = location.name.split(' ').join('+');
                  locationsGoogleMap =
                    `${locationsGoogleMap}/${nameOfLocation}`;
                  callback();
                }, (err) => {
                  if (err) console.log(err);
                  return sendMessage(senderId,
                    product_data.itineraryNotifications(`${locale === 'fr' ?
                      itineraryToSend.descriptionFr :
                      itineraryToSend.description}`,
                      numberDay, 1, idProgram, locationsGoogleMap), "RESPONSE")
                });
              })
              .catch(err => console.log(err.response.data))
          })
        })
        .catch(err => console.log(err))
    })
    .catch(err => console.log(err))
};