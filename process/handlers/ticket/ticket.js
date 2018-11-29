const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const config = require("../../../config");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const ViewTicket = require('../../../view/Ticket/ViewTicket');
const ticketQuery = require('../../../helpers/graphql/affiliation/query');
const Error = require('../error/error');

class Ticket {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.error = new Error(this.event);
  }

  start() {
    this.sendTickets()
  }

  sendTickets() {
    const viewTicket = new ViewTicket(this.event.locale, this.user);
    let messageArray = [
      ViewChatAction.markSeen(),
      ViewChatAction.typingOn(),
      ViewChatAction.smallPause(),
      ViewChatAction.typingOff()
    ];
    const apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi);
    return apiGraphql.sendQuery(
      ticketQuery.affiliations(parseInt(this.context.page),
        this.user.cityTraveling))
      .then(res => {
        if (res.affiliations !== null && res.affiliations.length > 0) {
          return viewTicket
            .init(res.affiliations)
            .then(messageTicket => {
              const newMessageArray = [
                ...messageArray,
                messageTicket,
                ViewChatAction.markSeen(),
                ViewChatAction.typingOn(),
                ViewChatAction.mediumPause(),
                ViewChatAction.typingOff(),
                viewTicket.lastMessage(),
              ];
              const newMessage = new Message(this.event.senderId,
                newMessageArray);
              newMessage.sendMessage();
            })
        } else {
          messageArray.push(viewTicket.emptyMessage());
          const newMessage = new Message(this.event.senderId, messageArray);
          newMessage.sendMessage();
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }
}
module.exports = Ticket;