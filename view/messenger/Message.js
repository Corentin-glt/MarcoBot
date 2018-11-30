/**
 * Created by corentin on 08/11/2018.
 */
const apiMessenger = require("../../helpers/Api/apiMessenger");
const breakText = require("../../helpers/breakText");
const Sentry = require("@sentry/node");

class Message {
  constructor(senderID, message) {
    this.senderID = senderID;
    this.message = message;
    this.messages = [];
  }

  sendSingle(message) {
    if (
      typeof message === "object" &&
      typeof message.messagePause === "number"
    ) {
      return new Promise(resolve =>
        setTimeout(resolve, parseInt(message.messagePause, 10))
      );
    }
    const messageBody = {
      recipient: {
        id: this.senderID
      }
    };

    if (message.hasOwnProperty("messaging_type")) {
      messageBody.messaging_type = message.messaging_type;
      delete message.messaging_type;
    }
    if (message.hasOwnProperty("message_tag")) {
      messageBody.tag = message.message_tag;
      delete message.message_tag;
    }
    if (message.hasOwnProperty("notification_type")) {
      messageBody.notification_type = message.notification_type;
      delete message.notification_type;
    }
    if (message.hasOwnProperty("sender_action")) {
      messageBody.sender_action = message.sender_action;
    } else {
      messageBody.message = message;
    }
    console.log(messageBody);
    return apiMessenger.sendToFacebook(messageBody);
  }

  sendMessage() {
    if (typeof this.message === "string") {
      this.messages = this.breakTextAndReturnFormatted(this.message);
    } else if (Array.isArray(this.message)) {
      this.message.forEach(msg => {
        if (typeof msg === "string") {
          this.messages = this.messages.concat(
            this.breakTextAndReturnFormatted(msg)
          );
        } else {
          this.messages.push(msg);
        }
      });
    } else if (!this.message) {
      return Promise.resolve();
    } else {
      this.messages = [this.message];
    }
    return this.sendAll();
  }

  sendAll() {
    if (!this.messages.length || this.messages.length === 0) {
      return Promise.resolve();
    } else {
      return this.sendSingle(this.messages.shift())
        .then(res => {
          return this.sendAll();
        })
        .catch(err => {
          console.log(err.response.data.error);
          Sentry.captureException(err);
        });
    }
  }

  breakTextAndReturnFormatted(message) {
    return breakText(message, 640).map(m => ({ text: m }));
  }
}

module.exports = Message;
