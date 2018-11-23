

const Message = require('../../../view/messenger/Message');
const ViewSubscribe = require('../../../view/subscribe/ViewSubscribe');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const accountMessenger = require('../../../helpers/graphql/accountMessenger/mutation');
const config = require("../../../config");
const Sentry = require("@sentry/node");


class Subscribe {
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
    const subscription = this.context.values.find(value => value.name === 'subscription');
    const subscribeMessage = new ViewSubscribe(this.user, this.event.locale);
    let messageArray = [ViewChatAction.markSeen(),
      ViewChatAction.typingOn(), ViewChatAction.typingOff()];
    if (typeof subscription === 'undefined') {
      messageArray.push(subscribeMessage.wouldYouSubOrUnsub());
     new Message(this.event.senderId, messageArray).sendMessage();
    } else {
      this.apiGraphql.sendMutation(accountMessenger.updateSubAccountMessenger(), {
        PSID: this.event.senderId.toString(),
        subscribe: JSON.parse(subscription.value)
      })
        .then(response => {
          if (response && JSON.parse(subscription.value)) {
            messageArray.push(subscribeMessage.subscribeMessage());
            new Message(this.event.senderId, messageArray).sendMessage();
          } else if (response && !JSON.parse(subscription.value)) {
            messageArray.push(subscribeMessage.unsubscribeMessage());
            new Message(this.event.senderId, messageArray).sendMessage();
          } else {
            messageArray.push(subscribeMessage.unsubscribeErrorMessage())
            new Message(this.event.senderId, messageArray).sendMessage();
          }
        })
        .catch(err => Sentry.captureException(err));
    }

  }
}

module.exports = Subscribe;


