const Message = require('../../../view/messenger/Message');
const ViewStart = require('../../../view/start/ViewStart');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');


class Start {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start() {
    if (this.context.values.length === 0) {
      const startMessages = new ViewStart(this.user, this.event.locale);
      const messageArray = [ViewChatAction.markSeen(),
        ViewChatAction.typingOn(), ViewChatAction.typingOff(),
        startMessages.initMessage(), ViewChatAction.typingOn(),
        ViewChatAction.longPause(), ViewChatAction.typingOff(),
        startMessages.problemMessage(), ViewChatAction.typingOn(),
        ViewChatAction.smallPause(), ViewChatAction.typingOff(),
        startMessages.whatMessage(), ViewChatAction.typingOn(),
        ViewChatAction.smallPause(), ViewChatAction.typingOff(),
        startMessages.excitementMessage()];
      const newMessage = new Message(this.event.senderId, messageArray);
      newMessage.sendMessage();
    } else {
      if (this.context.values[0].value) {

      } else {


      }
    }
  }
}

module.exports = Start;