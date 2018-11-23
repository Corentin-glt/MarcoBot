const ViewHelp = require('../../../view/help/ViewHelp');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const Message = require('../../../view/messenger/Message');
const contextMutation = require('../../../helpers/graphql/context/mutation');
const Sentry = require("@sentry/node");
const config = require("../../../config");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");

class Help {
  constructor(event, context, user) {
    console.log('CONSTRUCTOR');
    this.event = event;
    this.context = context;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    console.log('START');
    const helpMessage = new ViewHelp(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(), ViewChatAction.typingOff(),
      helpMessage.helpmessage(),
      ViewChatAction.typingOn(), ViewChatAction.smallPause(),
      ViewChatAction.typingOff(),
      helpMessage.startTalkingWithHumanHelp()
    ];
    const objToSend = {
      PSID: this.event.senderId,
      name: 'talkingToHuman',
      page: 0,
      values: [{
        name: 'isTalking',
        value: 'true'
      }]
    };
    console.log(objToSend);
    const messagesToSend = new Message(this.event.senderId, messageArray);
    this.apiGraphql.sendMutation(contextMutation.createContext(), objToSend)
      .then(res => {
        messagesToSend.sendMessage();
      })
      .catch(err => Sentry.captureException(err))
  }


}

module.exports = Help;