const Message = require('../../../view/messenger/Message');
const ViewStart = require('../../../view/start/ViewStart');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const config = require("../../../config");
const Sentry = require("@sentry/node");
const Error = require('../error/error');

class Start {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.error = new Error(this.event);
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    const startMessages = new ViewStart(this.user, this.event.locale);
    if (this.context.values.length === 0) {
      const messageArray = [ViewChatAction.markSeen(),
        ViewChatAction.typingOn(), ViewChatAction.typingOff(),
        startMessages.initMessage(), ViewChatAction.typingOn(),
        ViewChatAction.longPause(), ViewChatAction.typingOff(),
        startMessages.problemMessage(), ViewChatAction.typingOn(),
        ViewChatAction.smallPause(), ViewChatAction.typingOff(),
        startMessages.whatMessage(), ViewChatAction.typingOn(),
        ViewChatAction.smallPause(), ViewChatAction.typingOff(),
        startMessages.excitementMessage()];
      const newMessage = new Message(this.event.senderId, messageArray);
      newMessage.sendMessage();
    } else {
      if (JSON.parse(this.context.values[0].value)) {
        const messageArray = [ViewChatAction.markSeen(),
          ViewChatAction.typingOn(), ViewChatAction.typingOff(),
          startMessages.excitementConfirm1(), ViewChatAction.typingOn(),
          ViewChatAction.typingOff(), startMessages.excitementConfirm2(),
          ViewChatAction.typingOn(),
          ViewChatAction.smallPause(), ViewChatAction.typingOff(),
          startMessages.excitementConfirm3(), ViewChatAction.typingOn(),
          ViewChatAction.typingOff(), startMessages.chooseCity()
        ];
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      } else {
        this.apiGraphql
          .sendMutation(contextMutation.createContext(), {
            PSID: this.event.senderId,
            name: 'feedback',
            page: 0,
            values: []
          })
          .then(res => {
            const messageArray = [ViewChatAction.markSeen(),
              ViewChatAction.typingOn(), ViewChatAction.typingOff(),
              startMessages.excitementCancel1(), ViewChatAction.typingOn(),
              ViewChatAction.smallPause(), ViewChatAction.typingOff(),
              startMessages.excitementCancel2(), ViewChatAction.typingOn(),
              ViewChatAction.smallPause(), ViewChatAction.typingOff(),
              startMessages.excitementFeedback()
            ];
            const newMessage = new Message(this.event.senderId, messageArray);
            newMessage.sendMessage();
          })
          .catch(err => {
            this.error.start();
            Sentry.captureException(err);
          })
      }
    }
  }
}

module.exports = Start;