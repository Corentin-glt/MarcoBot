const Message = require('../../../view/messenger/Message');
const ViewTalkingToHuman = require('../../../view/talkingToHuman/ViewTalkingToHuman');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const userMutation = require('../../../helpers/graphql/user/mutation');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const config = require("../../../config");
const Sentry = require("@sentry/node");


class TalkingToHuman {
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
    const talking = this.context.values.find(value => value.name === 'isTalking');
    const talkingMessage = new ViewTalkingToHuman(this.user, this.event.locale);
    this.apiGraphql.sendMutation(userMutation.updateIsTalkingWithHuman(),
      {PSID: this.event.senderId, isTalkingToHuman: JSON.parse(talking.value)})
      .then((response) => {
        let messageArray = [ViewChatAction.markSeen(),
          ViewChatAction.typingOn(), ViewChatAction.typingOff()];
        if (JSON.parse(talking.value)) {
          messageArray.push(talkingMessage.startTalking());
        } else {
          messageArray.push(talkingMessage.menu())
        }
        const messageToSend = new Message(this.event.senderId, messageArray);
        messageToSend.sendMessage();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }
}

module.exports = TalkingToHuman;
