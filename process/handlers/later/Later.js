/**
 * Created by corentin on 26/11/2018.
 */
const valueLater = require('../../../assets/values/later');
const Message = require('../../../view/messenger/Message');
const ViewLater = require('../../../view/Later/ViewLater');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ApiReferral = require("../../../helpers/Api/apiReferral");
const laterMutation = require("../../../helpers/graphql/later/mutation");
const laterQuery = require('../../../helpers/graphql/later/query');
const config = require("../../../config");
const Sentry = require("@sentry/node");
const async = require('async');
const contextQuery = require("../../../helpers/graphql/context/query");
const contextMutation = require("../../../helpers/graphql/context/mutation");

const contextsCanLater = ['description'];

class Later {
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
    if (valueLater.length !== this.context.values.length) {
      this.findContext()
        .then(context => {
          this.updateContext(context)
        })
    } else {
      this.createLater()
    }
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
              const contextNext = contextsCanLater.find(item => {
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

  updateContext(context){
    const filter = {
      contextId: this.context.id,
      values: context.values,
    };
    this.apiGraphql
      .sendMutation(contextMutation.updateContextByPage(), filter)
      .then(res => {
        this.context = res.updateContextByPage;
        this.createLater();
      })
      .catch(err => {
        Sentry.captureException(err);
      });
  }

  createLater() {
    const event = this.context.values.find(value => {
      return value.name === 'event';
    }).value;
    const idEvent = this.context.values.find(value => {
      return value.name === 'id';
    }).value;
    ApiReferral.sendReferral("later", this.event.senderId);
    const paramsLater = {
      users_id: this.user.id,
      eventName: `${event}s_id`,
    };
    paramsLater[`${event}s_id`] = idEvent;
    this.apiGraphql
      .sendMutation(laterMutation.createLater(), paramsLater)
      .then(res => {
        const viewLater = new ViewLater(this.event.locale, this.user);
        const messageArray = [
          ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          viewLater.saveIt(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(),
          ViewChatAction.typingOff(),
          viewLater.finalMessage(),
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => Sentry.captureException(err))

  }

}

module.exports = Later;