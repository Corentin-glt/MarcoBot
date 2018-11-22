const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ViewMap = require('../../../view/map/ViewMap');
const Message = require('../../../view/messenger/Message');

class Map {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start() {
    const location = this.context.values.find(
      value => value.name === 'location');
    const menuMessage = new ViewMap(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(), ViewChatAction.typingOff(),
      menuMessage.showMap(location.value), ViewChatAction.typingOn(),
      ViewChatAction.smallPause(), ViewChatAction.typingOff(),
      menuMessage.mapMenu()
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }
}

module.exports = Map;
