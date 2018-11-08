/**
 * Created by corentin on 07/11/2018.
 */

const receivedPostback = require('./handlers/receivedPostback');
const receivedQuickReply = require('./handlers/receivedQuickReply');
const receivedAttachments = require('./handlers/receivedAttachments/receivedAttachments');

module.exports = (event) => {
  if(event.message) {
    event.message.attachments ?
      receivedAttachments(event)
      : receivedQuickReply(event)
  } else {
    receivedPostback(event)
  }
};