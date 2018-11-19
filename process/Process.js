const ApiGraphql = require('../helpers/Api/apiGraphql');
const config = require("../config");
const contextQuery = require('../helpers/graphql/context/query');
const userQuery = require('../helpers/graphql/user/query');
const Sentry = require('@sentry/node');

const processEat = require('./handlers/eat/eat');
const processDrink = require('./handlers/drink/drink');
const processAroundMe = require('./handlers/aroundMe/aroundMe');
const processBack = require('./handlers/back/back');
const processChangeCity = require('./handlers/changeCity/changeCity');
const processFavorite = require('./handlers/favorite/favorite');
const processFeedback = require('./handlers/feedback/feedback');
const processGo = require('./handlers/go/go');
const processHelp = require('./handlers/help/help');
const processItinerary = require('./handlers/itinerary/itinerary');
const processMenu = require('./handlers/menu/menu');
const processShare = require('./handlers/share/share');
const processStart = require('./handlers/start/start');
const processSubscribe = require('./handlers/subscribe/subscribe');
const processTalkingToHuman = require('./handlers/talkingToHuman/talkingToHuman');
const processTicket = require('./handlers/ticket/ticket');
const processTrip = require('./handlers/trip/trip');
const processVisit = require('./handlers/visit/visit');
const processNext = require('./handlers/next/next');
const processMap = require('./handlers/map/map');

const contextMap = {
  'eat': processEat,
  'drink': processDrink,
  'aroundMe': processAroundMe,
  'back': processBack,
  'changeCity': processChangeCity,
  'favorite': processFavorite,
  'feedback': processFeedback,
  'go': processGo,
  'help': processHelp,
  'itinerary': processItinerary,
  'menu': processMenu,
  'share': processShare,
  'start': processStart,
  'subscribe': processSubscribe,
  'talkingToHuman': processTalkingToHuman,
  'ticket': processTicket,
  'trip': processTrip,
  'visit': processVisit,
  'next': processNext,
  'map': processMap,
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
              console.log(res.contextsByUser);
              const contextArray = res.contextsByUser;
              const processfunc = contextMap[contextArray[0].name];
              processfunc(this.event, contextArray[0], user)
            })
            .catch(err => {
              console.log(err);
              Sentry.captureException(err);
            })
        } else {
          console.log('user not found');
          Sentry.captureException('user not found in process');
        }
      })
      .catch(err => {
        console.log(err);
        Sentry.captureException(err);
      })
  }
}


module.exports = Process;