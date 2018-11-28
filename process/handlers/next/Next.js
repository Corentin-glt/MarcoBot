const contextsCanNext = require('./contextsCanNext');
const async = require('async');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const config = require("../../../config");
const contextQuery = require("../../../helpers/graphql/context/query");
const contextMutation = require("../../../helpers/graphql/context/mutation");

const ProcessEat = require("../eat/Eat");
const ProcessDrink = require("../drink/Drink");
const ProcessItinerary = require("../itinerary/itinerary");
const ProcessVisit = require("../visit/Visit");
const ProcessAroundMe = require("../aroundMe/AroundMe");
const ProcessFavorite = require("../favorite/favorite");
const ProcessTicket = require("../ticket/ticket");

const contextMap = {
  eat: ProcessEat,
  drink: ProcessDrink,
  itinerary: ProcessItinerary,
  visit: ProcessVisit,
  aroundMe: ProcessAroundMe,
  favorite: ProcessFavorite,
  ticket: ProcessTicket,
};

class Next {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    this.findContext()
      .then(context => {
        this.updateContext(context)
      })
      .catch(err => Sentry.captureException(err))
  }

  findContext() {
    let page = 0;
    let contextFound = false;
    return new Promise((resolve, reject) => {
      async.whilst(
        () => contextFound === false,
        (callback) => {
          this.apiGraphql
            .sendQuery(
              contextQuery.getUserContextByPage(this.event.senderId, page))
            .then(res => {
              page++;
              const contextArray = res.contextsByUserAndPage;
              const contextNext = contextsCanNext.find(item => {
                return item === contextArray[0].name;
              });
              if (typeof contextNext !== 'undefined') {
                contextFound = true;
                callback(null, contextArray[0]);
              } else {
                callback(null, contextArray[0]);
              }
            })
            .catch(err => callback(err))
        },
        (err, context) => {
          if (err) return reject(err);
          if (contextFound) {
            return resolve(context)
          }
        }
      )
    })
  }

  updateContext(context) {
    console.log('YOLOOOOO');
    console.log(context.name);
    const filter = {
      contextId: context.id,
      page: parseInt(context.page) + 1,
    };
    this.apiGraphql
      .sendMutation(contextMutation.updateContextByPage(), filter)
      .then(res => {
        const newContext = res.updateContextByPage;
        const processObject = new contextMap[newContext.name](
          this.event,
          newContext,
          this.user
        );
        processObject.start();
      })
      .catch(err => {
        Sentry.captureException(err);
      });
  }
}

module.exports = Next;