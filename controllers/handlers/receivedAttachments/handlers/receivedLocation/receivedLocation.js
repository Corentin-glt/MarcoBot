/**
 * Created by corentin on 07/11/2018.
 */
const Sentry = require('@sentry/node');
const config = require('../../../../../config');
const ApiGraphql = require('../../../../../helpers/Api/apiGraphql');
const user = require("../../../../../helpers/graphql/user/query");
const receiveLocationItinerary = require('./handlers/receiveLocationItinerary');
const receiveLocationAroundMe = require('./handlers/receiveLocationAroundMe');
const contextQuery = require("../../../../../helpers/graphql/context/query");
const mutationQuery = require(
  "../../../../../helpers/graphql/context/mutation");
const async = require('async');
const ProcessGo = require("../../../../../process/handlers/go/Go");
const ProcessAroundMe = require(
  "../../../../../process/handlers/aroundMe/AroundMe");

const contextsCanLocation = ['aroundMe', 'go'];
const contextMap = {
  go: ProcessGo,
  aroundMe: ProcessAroundMe,
};

class ReceiveLocation {
  constructor(event) {
    this.event = event;
    this.location = this.event.message.attachments[0].payload.coordinates;
    this.apiGraphql =
      new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl,
        config.accessTokenMarcoApi);

  }

  start() {
    this.apiGraphql
      .sendQuery(user.queryUserByAccountMessenger(this.event.senderId))
      .then(res => {
        this.user = res.userByAccountMessenger;
        return this.findContext()
      })
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
              const contextNext = contextsCanLocation.find(item => {
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
    const newValues = [
      ...context.values,
      {
        name: 'updateLocation',
        value: 'true'
      },
      {
        name: 'lat',
        value: `${this.location.lat}`,
      },
      {
        name: 'lng',
        value: `${this.location.long}`
      }
    ];
    const filter = {
      contextId: context.id,
      values: newValues,
    };
    this.apiGraphql
      .sendMutation(mutationQuery.updateContextByPage(), filter)
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

module.exports = ReceiveLocation;