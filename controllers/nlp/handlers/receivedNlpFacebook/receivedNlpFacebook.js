/**
 * Created by corentin on 08/11/2018.
 */
const receiveDateArrival = require('./handlers/receiveDateArrival');
const receiveDurationTravel = require('./handlers/receiveDurationTravel');
const dialogflow = require('../dialogflow/dialogflow');

module.exports = (event) => {
  if (event.message.nlp.entities.datetime
    && event.message.nlp.entities.datetime[0].confidence > 0.8) {
    receiveDateArrival(event);
  } else if (event.message.nlp.entities.duration
    && event.message.nlp.entities.duration[0].normalized.value
    && event.message.nlp.entities.duration[0].confidence > 0.8) {
    receiveDurationTravel(event);
  } else {
    dialogflow(event);
  }
};