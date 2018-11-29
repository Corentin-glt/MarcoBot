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
const FindContext = require('../findContext/FindContext');
const contextMutation = require("../../../helpers/graphql/context/mutation");
const Error = require('../error/error');
const contextsCanLater = ['description'];

class Later {
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
    if (valueLater.length !== this.context.values.length) {
      new FindContext(this.event, contextsCanLater)
        .start()
        .then(context => {
          this.updateContext(context)
        })
        .catch(err => {
          this.error.start();
        })
    } else {
      this.createLater()
    }
  }

  updateContext(context) {
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
        this.error.start();
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
      .catch(err => {
        const Error = new ErrorMessage(this.event);
        Error.start();
        Sentry.captureException(err)
      })
  }

}

module.exports = Later;