const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const ViewDefault = require("../../../view/default/ViewDefault");
const Message = require("../../../view/messenger/Message");
const config = require('../../../config');

class Feedback {
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
    const message = this.context.values.find(value => value.name === "message");
    if (message.value) {

    const viewDefault = new ViewDefault(this.event.locale, this.user);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      viewDefault.feedbackDefault(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  } else {
      const viewDefault = new ViewDefault(this.event.locale, this.user);
      const messageArray = [
        ViewChatAction.markSeen(),
        ViewChatAction.typingOn(),
        ViewChatAction.smallPause(),
        ViewChatAction.typingOff(),
        viewDefault.feedbackDefaultError(),
      ];
      const newMessage = new Message(this.event.senderId, messageArray);
      newMessage.sendMessage();
    }
  }
}

module.exports = Feedback;