const contextsCanNext = require('./contextsCanNext');
const async = require('async');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewNext = require('../../../view/Next/ViewNext');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const config = require("../../../config");
const contextQuery = require("../../../helpers/graphql/context/query");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const FindContext = require('../findContext/FindContext');
const ProcessEat = require("../eat/Eat");
const ProcessDrink = require("../drink/Drink");
const ProcessItinerary = require("../itinerary/itinerary");
const ProcessVisit = require("../visit/Visit");
const ProcessAroundMe = require("../aroundMe/AroundMe");
const ProcessFavorite = require("../favorite/favorite");
const ProcessTicket = require("../ticket/ticket");
const Error = require('../error/error');

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
    this.error = new Error(this.event);
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    new FindContext(this.event, contextsCanNext)
      .start()
      .then(context => {
        this.updateContext(context)
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      })
  }

  updateContext(context) {
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
        this.error.start();
        Sentry.captureException(err);
      });
  }
}

module.exports = Next;