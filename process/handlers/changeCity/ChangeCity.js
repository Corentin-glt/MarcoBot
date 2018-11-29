const Message = require('../../../view/messenger/Message');
const ViewChangeCity = require('../../../view/changeCity/ViewChangeCity');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const userMutation = require('../../../helpers/graphql/user/mutation');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewDefault = require('../../../view/default/ViewDefault');
const accountMessenger = require(
  '../../../helpers/graphql/accountMessenger/mutation');
const config = require("../../../config");
const Sentry = require("@sentry/node");
const Error = require('../error/error');

class ChangeCity {
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
    const city = this.context.values.find(value => value.name === 'city');
    const changeCityMessage = new ViewChangeCity(this.user, this.event.locale);
    let messageArray = null;
    if (city) {
      if (typeof city.value !== 'undefined' && city.value !== null) {
        this.apiGraphql.sendMutation(userMutation.updateCityTraveling(), {
          PSID: this.event.senderId,
          cityTraveling: city.value.toLowerCase()
        })
          .then(user => {
            messageArray = [ViewChatAction.markSeen(),
              ViewChatAction.typingOn(), ViewChatAction.typingOff(),
              changeCityMessage.cityChosen(city.value.toLowerCase()),
              ViewChatAction.typingOn(), ViewChatAction.typingOff(),
              changeCityMessage.cityMenu()];
            new Message(this.event.senderId, messageArray).sendMessage();
          })
          .catch(err => {
            this.error.start();
            Sentry.captureException(err)
          });
      } else {
        const defaultMessage = new ViewDefault(this.user, this.event.locale);
        const messageArray = [ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.typingOff(), defaultMessage.noCityDefault(),
          ViewChatAction.typingOn(),
          ViewChatAction.typingOff(), defaultMessage.changeCityDefault()];
        new Message(this.event.senderId, messageArray).sendMessage();
      }
    } else {
      messageArray = [
        ViewChatAction.markSeen(),
        ViewChatAction.typingOn(), ViewChatAction.typingOff(),
        changeCityMessage.changeCityMessage(), ViewChatAction.typingOn(),
        ViewChatAction.smallPause(), ViewChatAction.typingOff(),
        changeCityMessage.changeCity()
      ];
      new Message(this.event.senderId, messageArray).sendMessage();
    }
  }
}

module.exports = ChangeCity;