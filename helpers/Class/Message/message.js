/**
 * Created by corentin on 08/11/2018.
 */
const apiMessenger = require('../../Api/apiMessenger');

class Message {
  constructor(senderID) {
    this._senderID = senderID
  }

  set typeMessage(typeMessage) {
    this._typeMessage = typeMessage;
  }

  get typeMessage() {
    return this._typeMessage;
  }

  get senderID() {
    return this._senderID;
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      const objectToSend = {
        recipient: {id: this.senderID},
        messaging_types: this.typeMessage,
        message: message
      };
      apiMessenger.sendToFacebook(objectToSend)
        .then((res) => resolve(res))
        .catch(err => reject(err));
    })
  }

  sendWaitingMessage() {
    return new Promise((resolve, reject) => {
      const objectToSend = {
        recipient: {id: this.senderID},
        sender_action: 'typing_on',
        messaging_types: this.typeMessage,
        message: ""
      };
      apiMessenger.sendToFacebook(objectToSend)
        .then((res) => resolve(res))
        .catch(err => reject(err));
    })
  }
}

module.exports = Message;