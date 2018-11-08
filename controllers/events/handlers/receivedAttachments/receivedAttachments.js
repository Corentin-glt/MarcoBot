/**
 * Created by corentin on 07/11/2018.
 */
const receivedLocation = require('./handlers/receivedLocation/receivedLocation');
const receivedAudio = require('./handlers/receivedAudio');
const receivedFile = require('./handlers/receivedFile');
const receivedFallback = require('./handlers/receivedFallback');
const receivedVideo = require('./handlers/receivedVideo');
const receivedImage = require('./handlers/receivedImage');

module.exports = (event) => {
  switch(event.message.attachments[0].type){
    case 'location':
      receivedLocation(event);
      break;
    case 'audio':
      receivedAudio(event);
      break;
    case 'fallback':
      receivedFallback(event);
      break;
    case 'file':
      receivedFile(event);
      break;
    case 'image':
      receivedImage(event);
      break;
    case 'video':
      receivedVideo(event);
      break;
    default:
      receivedLocation(event);
      break;
  }
};