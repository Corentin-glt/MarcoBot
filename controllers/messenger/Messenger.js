const receivedLocation = require(
  '../handlers/receivedAttachments/handlers/receivedLocation/receivedLocation');
const contextMessenger = require('./contextMessenger');
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const Sentry = require('@sentry/node');
const config = require('../../config');
const contextQuery = require('../../helpers/graphql/context/query');
const Context = require('../../process/Context');
const contextValues = require('./handlers/index');


class Messenger {
  constructor(event) {
    this.event = event;
  }

  handle() {
    if (this.event.message) {
      this.event.message.attachments ?
        this.receivedAttachments()
        : this.receivedQuickReply();
    } else {
      this.receivedPostback();
    }
  }

  receivedAttachments() {
    switch (this.event.message.attachments[0].type) {
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

  getContextValues(splittedPayload) {
    let objValue = {};
    for (let i = 1; i < splittedPayload.length; i++) {
      const valuePayload = splittedPayload[i].split(':');
      objValue[valuePayload[0]] = valuePayload[1];
    }
    return objValue;
  }

  receivedQuickReply() {
    const payload = this.event.message.quick_reply.payload;
    const splittedPayload = payload.split('_');
    const context = new Context(this.event.senderId, splittedPayload[0],
      this.getContextValues(splittedPayload), contextMessenger);
    context.mapContext();
    // context.getValues();
    // this.getContextValues(splittedPayload);
  }

  receivedPostback() {
    console.log('postback');
    const payload = this.event.postback.payload;
    const splittedPayload = payload.split('_');
    const context = new Context(this.event.senderId, splittedPayload[0],
      this.getContextValues(splittedPayload), contextMessenger);
    console.log('received Postbakc');
    context.mapContext();
  }
}

module
  .exports = Messenger;