const receivedPostback = require('../handlers/receivedPostback');
const receivedQuickReply = require('../handlers/receivedQuickReply');
const receivedAttachments = require(
  '../handlers/receivedAttachments/receivedAttachments');
const receivedLocation = require(
  '../handlers/receivedAttachments/handlers/receivedLocation/receivedLocation');
const contextMessenger = require('./contextMessenger');
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const Sentry = require('@sentry/node');
const config = require('../../config');
const contextQuery = require('../../graphql/context/query');



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

  mapContext(payload) {
    console.log('RECIEVED PAYLOAD ==> ' + payload);
    // const apiGraphql = new ApiGraphql(
    //   config.category[config.indexCategory].apiGraphQlUrl,
    //   config.accessTokenMarcoApi);
    // apiGraphql.sendQuery(contextQuery.getUserContext(this.event.senderId))
    //   .then(res => {
    //     console.log(res);
        const context = Object.keys(contextMessenger).find((key, idx) => {
          const elemFound = contextMessenger[key].find(elem => {
            return elem === payload;
          });
          return elemFound !== null && typeof elemFound !== 'undefined';
        });
        console.log(context);
      // })
      // .catch(err => Sentry.captureException(err));
  }

  getContextValues(splittedPayload) {
    let arrayValues = [];
    for(let i=1; i < splittedPayload.length; i++) {

    }
  }

  compareContext(mappedContext) {

  }

    receivedQuickReply()
    {
      const payload = this.event.message.quick_reply.payload;
      const splittedPayload = payload.split('_');
      this.mapContext(splittedPayload[0]);
      this.getContextValues(splittedPayload);
    }

    receivedPostback()
    {
      const payload = this.event.postback.payload;
      console.log(payload);
      console.log(payload.split('_')[0]);
      this.mapContext(payload.split('_')[0]);
    }
  }

  module
.
  exports = Messenger;