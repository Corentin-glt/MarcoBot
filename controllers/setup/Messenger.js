const receivedPostback = require('../handlers/receivedPostback');
const receivedQuickReply = require('../handlers/receivedQuickReply');
const receivedAttachments = require('../handlers/receivedAttachments/receivedAttachments');
const receivedLocation = require('../handlers/receivedAttachments/handlers/receivedLocation/receivedLocation');


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

  receivedAttachments() {
    switch(event.message.attachments[0].type){
      case 'location':
        receivedLocation(event);
        break;
      case 'audio':
        // receivedAudio(event);
        break;
      case 'fallback':
        // receivedFallback(event);
        break;
      case 'file':
        // receivedFile(event);
        break;
      case 'image':
        // receivedImage(event);
        break;
      case 'video':
        // receivedVideo(event);
        break;
      default:
        receivedLocation(event);
        break;
    }
  }

  receivedQuickReply() {
    const payload = this.event.message.quick_reply.payload;
    const context = new Context(payload);
  }

  receivedPostback () {
    const payload = this.event.postback.payload;
    const context = new Context(payload);
  }
}

module.exports = Messenger;