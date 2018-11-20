const Pause = require('../messenger/Pause');
const ChatAction = require('../messenger/ChatAction');

class ViewChatAction {
  static smallPause() {
    return new Pause(2000).get();
  }

  static mediumPause() {
    return new Pause(4000).get();
  }

  static longPause() {
    return new Pause(6000).get();

  }

  static typingOn() {
   return new ChatAction('typing_on').get();
  }

  static typingOff() {
    return new ChatAction('typing_off').get()
  }

  static markSeen() {
    return new ChatAction('mark_seen').get();
  }
}

module.exports = ViewChatAction;