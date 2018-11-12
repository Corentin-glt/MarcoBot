const ApiGraphql = require('../../helpers/Api/apiGraphql');
const config = require('../../config');
const Sentry = require('@sentry/node');
const userMutation = require('../../graphql/user/mutation');
const stopTalking = require('../handlers/stopTalkingWithHuman');
const WitAi = require('./WitAi');
const receiveDateArrival = require('../handlers/receiveDateArrival');
const receiveDurationTravel = require('../handlers/receiveDurationTravel');
const DialogflowAi = require('./DialogflowAi');


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

class Nlp {
  constructor(event) {
    this.event = event;
  }

  handle(user) {
    if (user !== null
      && user.isTalkingToHuman) {
      this._checkIfWantStopChat();
    } else {
      this._checkDurationOrTravel();
    }
  }

  _checkIfWantStopChat() {
    const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
    if (messageToStopTalkingWithHuman.some(elem => elem.toUpperCase() === message.toUpperCase())) {
      return stopTalking(this.event.senderId, this.event.locale);
    } else {
      return apiGraphql.sendMutation(userMutation.updateUserByAccountMessenger(),
        {PSID: this.event.senderId, lastMessageToHuman: new Date()})
        .catch((err) => Sentry.captureException(err));
    }
  }

  _checkDurationOrTravel() {
    console.log(this.event);
      if (this.event.message && this.event.message.nlp) {
        this.receivedNLPFromFacebook();
      } else {
        const wit = new WitAi(this.event);
        wit._checkDurationWit();
      }
  }

  receivedNLPFromFacebook() {

    if (this.event.message.nlp.entities.datetime
      && this.event.message.nlp.entities.datetime[0].confidence > 0.8) {
      receiveDateArrival(this.event);
    } else if (this.event.message.nlp.entities.duration
      && this.event.message.nlp.entities.duration[0].normalized.value
      && this.event.message.nlp.entities.duration[0].confidence > 0.8) {
      receiveDurationTravel(this.event);
    } else {
      const dialogflow = new DialogflowAi(this.event);
      dialogflow.start();    }
  }
}

module.exports = Nlp;