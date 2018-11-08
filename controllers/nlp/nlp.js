/**
 * Created by corentin on 30/04/2018.
 */
const Config = require('../../config');

const user = require("../../graphql/user/query");
const userMutation = require("../../graphql/user/mutation");
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const Message = require('../../helpers/Class/Message/message');
const clientControl = require('./handlers/dialogflow/dialogflow');
const MessageData = require('../../messenger/product_data');
const config = require("../../config");
const stopTalking = require('./handlers/stopTalkingWithHuman');
const dialogflow = require('./handlers/dialogflow/dialogflow');
const Sentry = require('@sentry/node');
const {Wit, log} = require('node-wit');
const receiveDurationTravel = require('./handlers/receivedNlpFacebook/handlers/receiveDurationTravel');
const receivedNLPFromFacebook = require('./handlers/receivedNlpFacebook/receivedNlpFacebook');

const clientWit = new Wit({
  accessToken: Config.tokenWit,
  //logger: new log.Logger(log.DEBUG) // optional
});

const messageToStopTalkingWithHuman = [
  "start marco",
  "stop talking with human",
  "stop talking",
  "stop",
  "start bot",
  "start marcobot",
  "stop human",
  "i want marco",
  "i want marco back",
  "je veux Marco",
  "stop chat",
];

const _checkIfWantStopChat = (apiGraphql, senderId, locale, message) => {
  if (messageToStopTalkingWithHuman.some(elem => elem.toUpperCase() === message.toUpperCase())) {
    return stopTalking(senderId, locale);
  } else {
    return apiGraphql.sendMutation(userMutation.updateUserByAccountMessenger(),
      {PSID: senderId, lastMessageToHuman: new Date()})
      .catch((err) => Sentry.captureException(err));
  }
};

const _checkDurationWit = (event) => {
  //WORKOUT: WHEN WE RECEIVE THE DURATION FOR A TRIP IN ENGLISH
  //WE HAVE TO ASK WIT.AI IF THE MESSAGE IS A DURATION !!
  clientWit.message(message, {})
    .then((data) => {
      if (Object.keys(data.entities).length !== 0 && data.entities.duration !== null
        && typeof data.entities.duration !== "undefined" && data.entities.duration[0].normalized.value
        && data.entities.duration[0].confidence > 0.8) {
        let newEvent = Object.assign({}, event);
        newEvent['message']['nlp']['entities'] = data.entities;
        receiveDurationTravel(newEvent);
      } else {
        dialogflow(event)
      }
    })
    .catch((err) => Sentry.captureException(err));
};

const _checkDurationOrTravel = (event) => {
  if (event.message && event.message.nlp) {
    receivedNLPFromFacebook(event)
  } else {
    _checkDurationWit(event)
  }
};

module.exports = (event) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const locale = event.locale;
  const senderId = event.sender.id;
  const message = event.message.text;
  const query = user.queryUserByAccountMessenger(senderId);
  apiGraphql.sendQuery(query)
    .then(res => {
      if (res.userByAccountMessenger !== null
        && res.userByAccountMessenger.isTalkingToHuman) {
        _checkIfWantStopChat(apiGraphql, senderId, locale, message);
      } else {
        _checkDurationOrTravel(event)
      }
    })
    .catch((err) => Sentry.captureException(err));
};