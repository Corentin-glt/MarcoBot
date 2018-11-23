const ApiGraphql = require("../helpers/Api/apiGraphql");
const config = require("../config");
const contextQuery = require("../helpers/graphql/context/query");
const userQuery = require("../helpers/graphql/user/query");
const Sentry = require("@sentry/node");

const ProcessEat = require("./handlers/eat/Eat");
const ProcessDrink = require("./handlers/drink/Drink");
const ProcessAroundMe = require("./handlers/aroundMe/aroundMe");
const ProcessBack = require("./handlers/back/Back");
const ProcessChangeCity = require("./handlers/changeCity/changeCity");
const ProcessFavorite = require("./handlers/favorite/favorite");
const ProcessFeedback = require("./handlers/feedback/feedback");
const ProcessGo = require("./handlers/go/Go");
const ProcessHelp = require("./handlers/help/help");
const ProcessItinerary = require("./handlers/itinerary/itinerary");
const ProcessMenu = require("./handlers/menu/menu");
const ProcessShare = require("./handlers/share/share");
const ProcessStart = require("./handlers/start/start");
const ProcessSubscribe = require("./handlers/subscribe/subscribe");
const ProcessTalkingToHuman = require(
  "./handlers/talkingToHuman/talkingToHuman");
const ProcessTicket = require("./handlers/ticket/ticket");
const ProcessTrip = require("./handlers/trip/trip");
const ProcessVisit = require("./handlers/visit/Visit");
const ProcessNext = require("./handlers/next/Next");
const ProcessMap = require("./handlers/map/map");
const ProcessDescription = require("./handlers/description/Description");
const ProcessUnknown = require('./handlers/unknown/Unknown');

const contextMap = {
  eat: ProcessEat,
  drink: ProcessDrink,
  aroundMe: ProcessAroundMe,
  back: ProcessBack,
  changeCity: ProcessChangeCity,
  favorite: ProcessFavorite,
  feedback: ProcessFeedback,
  go: ProcessGo,
  help: ProcessHelp,
  itinerary: ProcessItinerary,
  menu: ProcessMenu,
  share: ProcessShare,
  start: ProcessStart,
  subscribe: ProcessSubscribe,
  talkingToHuman: ProcessTalkingToHuman,
  ticket: ProcessTicket,
  trip: ProcessTrip,
  visit: ProcessVisit,
  next: ProcessNext,
  map: ProcessMap,
<<<<<<< HEAD
  description: ProcessDescription,
=======
  unknown: ProcessUnknown
>>>>>>> 94a20105cda33674cb8e4e60a7d66cd2be13c426
};

class Process {
  constructor(event) {
    this.event = event;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    this.apiGraphql
      .sendQuery(userQuery.queryUserByAccountMessenger(this.event.senderId))
      .then(res => {
        const user = res.userByAccountMessenger;
        if (user) {
          this.apiGraphql
            .sendQuery(contextQuery.getUserContext(this.event.senderId))
            .then(res => {
              const contextArray = res.contextsByUser;
              const processObject = new contextMap[contextArray[0].name](
                this.event,
                contextArray[0],
                user
              );
              processObject.start();
            })
            .catch(err => {
              Sentry.captureException(err);
            });
        } else {
          Sentry.captureException("user not found in process");
        }
      })
      .catch(err => {
        Sentry.captureException(err);
      });
  }
}

module.exports = Process;
