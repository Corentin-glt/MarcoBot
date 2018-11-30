const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ViewMenu = require('../../../view/menu/ViewMenu');
const Message = require('../../../view/messenger/Message');

class Menu {
  constructor(event, contextArray, user) {
    this.event = event;
    this.context = contextArray[0];
    this.user = user;
  }

  start() {
    const menuMessage = new ViewMenu(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(), ViewChatAction.typingOff(), menuMessage.menu()
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }


}

module.exports = Menu;