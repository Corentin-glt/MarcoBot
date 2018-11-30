const ApiGraphql = require("../helpers/Api/apiGraphql");
const config = require("../config");
const contextQuery = require("../helpers/graphql/context/query");
const userQuery = require("../helpers/graphql/user/query");
const Sentry = require("@sentry/node");
const ErrorMessage = require('./handlers/error/error');
const ProcessEat = require("./handlers/eat/Eat");
const ProcessDrink = require("./handlers/drink/Drink");
const ProcessAroundMe = require("./handlers/aroundMe/AroundMe");
const ProcessBack = require("./handlers/back/Back");
const ProcessChangeCity = require("./handlers/changeCity/ChangeCity");
const ProcessFavorite = require("./handlers/favorite/Favorite");
const ProcessFeedback = require("./handlers/feedback/feedback");
const ProcessGo = require("./handlers/go/Go");
const ProcessHelp = require("./handlers/help/help");
const ProcessLater = require("./handlers/later/Later");
const ProcessItinerary = require("./handlers/itinerary/Itinerary");
const ProcessMenu = require("./handlers/menu/Menu");
const ProcessShare = require("./handlers/share/share");
const ProcessStart = require("./handlers/start/Start");
const ProcessSubscribe = require("./handlers/subscribe/subscribe");
const ProcessTalkingToHuman = require(
  "./handlers/talkingToHuman/talkingToHuman");
const ProcessTicket = require("./handlers/ticket/ticket");
const ProcessTrip = require("./handlers/trip/Trip");
const ProcessVisit = require("./handlers/visit/Visit");
const ProcessNext = require("./handlers/next/Next");
const ProcessMap = require("./handlers/map/Map");
const ProcessDescription = require("./handlers/description/Description");
const ProcessUnknown = require('./handlers/unknown/Unknown');
const Error = require('./handlers/error/error');

const contextMap = {
  eat: ProcessEat,
  drink: ProcessDrink,
  aroundMe: ProcessAroundMe,
  back: ProcessBack,
  changeCity: ProcessChangeCity,
  favorite: ProcessFavorite,
  feedback: ProcessFeedback,
  go: ProcessGo,
  later: ProcessLater,
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
  description: ProcessDescription,
  unknown: ProcessUnknown,
};

class Process {
  constructor(event) {
    this.event = event;
    this.error = new Error(this.event);
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
              this.error.start();
              Sentry.captureException(err);
            });
        } else {
          this.error.start();
          Sentry.captureException("user not found in process");
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err);
      });
  }
}

module.exports = Process;
