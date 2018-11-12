const receivedPostback = require('../handlers/receivedPostback');
const receivedQuickReply = require('../handlers/receivedQuickReply');
const receivedAttachments = require('../handlers/receivedAttachments/receivedAttachments');


class Messenger {
  constructor(event) {
    this.event = event;
  }

  handle() {
    if(this.event.message) {
      this.event.message.attachments ?
        receivedAttachments(this.event)
        : receivedQuickReply(this.event)
    } else {
      receivedPostback(this.event)
    }
  }

}

module.exports = Messenger;