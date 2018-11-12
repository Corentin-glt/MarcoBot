const {Wit, log} = require('node-wit');
const Config = require('../../config');
const receiveDurationTravel = require('../handlers/receiveDurationTravel');
const Sentry = require('@sentry/node');
const DialogflowAi = require('./DialogflowAi');



const clientWit = new Wit({
  accessToken: Config.tokenWit,
  //logger: new log.Logger(log.DEBUG) // optional
});

class WitAi {

  constructor(event) {
    console.log("CONSTRUCOTR wit");
    this.event = event;
  }

  _checkDurationWit()  {
    //WORKOUT: WHEN WE RECEIVE THE DURATION FOR A TRIP IN ENGLISH
    //WE HAVE TO ASK WIT.AI IF THE MESSAGE IS A DURATION !!
    clientWit.message(message, {})
      .then((data) => {
        if (Object.keys(data.entities).length !== 0 && data.entities.duration !== null
          && typeof data.entities.duration !== "undefined" && data.entities.duration[0].normalized.value
          && data.entities.duration[0].confidence > 0.8) {
          this.event['message']['nlp']['entities'] = data.entities;
          receiveDurationTravel(this.event);
        } else {
          const dialogflow = new DialogflowAi(this.event);
          dialogflow.start();
        }
      })
      .catch((err) => Sentry.captureException(err));
  };
}

module.export = WitAi;