/**
 * Created by corentin on 27/04/2018.
 */

const express = require("express");
const bodyParser = require("body-parser");
const Config = require("./config");
const app = express();
const PORT = Config.category[Config.indexCategory].port;
const verificationController = require("./controllers/verification");
const messageWebhookController = require("./controllers/messageWebhook");
const apiMessenger = require('./helpers/Api/apiMessenger');
const axios = require('axios');
const CronJob = require('cron').CronJob;
const cronMethods = require('./process/handlers/notifications/notifications');
const hoursCron = require('./assets/variableApp/hoursCron');
const Sentry = require('@sentry/node');
const ViewMenuMessenger = require('./view/MessengerComponents/ViewMessengerMenu');
const ViewStartMessenger = require('./view/MessengerComponents/ViewMessengerStart');
const ViewWelcomeMessenger = require('./view/MessengerComponents/ViewMessengerWelcome');
Sentry.init({dsn: Config.category[Config.indexCategory].dsnSentry});
//Sentry.init({ dsn: Config.dsnSentry});


app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());


const cronMorning = new CronJob(hoursCron["morning"], () => {
  const Cron = new cronMethods();
  Cron.sendProgram();
  console.log('cron MORNING begin');
}, () => {
  console.log('cron MORNING finished');
}, true, 'Europe/Paris');

const cronEndAfterNoon = new CronJob(hoursCron["endAfterNoon"], () => {
  const Cron = new cronMethods();
  Cron.readyForTomorrow();
  console.log('cron END AFTERNOON begin');
}, () => {
  console.log('cron END AFTERNOON finished');
}, true, 'Europe/Paris');

const cronEveryHour = new CronJob(hoursCron["everyHour"], () => {
  const Cron = new cronMethods();
  Cron.checkLastMessageToHuman();
  console.log('cron check lastMessage');
}, () => {
  console.log('cron check lastMessag finished');
}, true, 'Europe/Paris');

const cronSendInvitation = new CronJob(hoursCron["noon"], () => {
  console.log('Start cron invite');
  const Cron = new cronMethods();
  Cron.sendGroupInvitation();
  console.log('cron check invitation');
}, () => {
  console.log('cron check lastMessag finished');
}, true, 'Europe/Paris');



app.post("/", messageWebhookController);
app.get("/", verificationController);
axios.post(Config.category[Config.indexCategory].authUrlMarcoApi, {
  clientId: Config.clientId,
  clientSecret: Config.clientSecret,
  grantType: 'server'
})
  .then(res => {
    Config.accessTokenMarcoApi = res.data.token;
  })
  .catch(err => console.log(err));


//TODO Gros t'es relou à tout le temps commenter
axios.post(Config.category[Config.indexCategory].authUrlRecommendationApi, {
  clientId: Config.clientId,
  clientSecret: Config.clientSecret,
  grantType: 'server'
})
  .then(res => {
    Config.accessTokenRecommendationApi = res.data.token;
  })
  .catch(err => console.log(err));


app.get('/setup', (req, res) => {
  apiMessenger.callbackStartButton(ViewStartMessenger)
    .then(response => {
      return apiMessenger.callbackStartButton(ViewMenuMessenger)
    })
    .then(response => {
      return apiMessenger.callbackStartButton(ViewWelcomeMessenger)
    })
    .then(response => {
      res.send(response.data);
    })
    .catch(err => {
      res.send(err);
    });
});

app.listen(PORT, () => console.log("server listening to port ", PORT));
