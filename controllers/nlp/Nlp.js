const ApiGraphql = require('../../helpers/Api/apiGraphql');
const config = require('../../config');
const Sentry = require('@sentry/node');
const userMutation = require('../../helpers/graphql/user/mutation');
const ViewTalking = require('../../view/talkingToHuman/ViewTalkingToHuman');
const ViewChatAction = require('../../view/chatActions/ViewChatAction');
const Message = require('../../view/messenger/Message');
const DialogflowAi = require('./DialogflowAi');
const ErrorMessage = require('../../process/handlers/error/error');

const messageToStopTalkingWithHuman = [
  "start marco",
  "stop talking with human",
  "stop talking",
  "stop",
  "start bot",
  "start marcobot",
  "stop human",
  "i want marco",
  "i want marco back",
  "je veux Marco",
  "stop chat",
];

class Nlp {
  constructor(event) {
    this.event = event;
  }

  handle(user) {
    if (user !== null) {
      user.humanTalk()
        .then(user => {
          if (user.isTalkingToHuman) {
            this._checkIfWantStopChat(user);
          } else {
            const dialogflow = new DialogflowAi(this.event);
            dialogflow.start();
          }
        })
        .catch(err => Sentry.captureException(err));

    } else {
      const Error = new ErrorMessage(this.event);
      Error.start();
      Sentry.captureException('user not found');
    }
  }

  _checkIfWantStopChat(user) {
    const apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi);
    if (messageToStopTalkingWithHuman.some(
        elem => elem.toUpperCase() === this.event.message.text.toUpperCase())) {
      apiGraphql.sendMutation(userMutation.updateIsTalkingWithHuman(),
        {PSID: this.event.senderId, isTalkingToHuman: false})
        .then((response) => {
          const talkingMessage = new ViewTalking(user, this.event.locale);
          const messageArray = [
            ViewChatAction.markSeen(), ViewChatAction.typingOn(),
            ViewChatAction.typingOff(), talkingMessage.menu()
          ];
          new Message(this.event.senderId, messageArray).sendMessage();
        })
        .catch(err => {
          const Error = new ErrorMessage(this.event);
          Error.start();
          Sentry.captureException(err);
        });
    } else {
      apiGraphql.sendMutation(userMutation.updateUserByAccountMessenger(),
        {PSID: this.event.senderId, lastMessageToHuman: new Date()})
        .then(res => {
          console.log('update last message');
        })
        .catch((err) => {
          const Error = new ErrorMessage(this.event);
          Error.start();
          Sentry.captureException(err)
        });
    }
  }
}

module.exports = Nlp;
