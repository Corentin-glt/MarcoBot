const Message = require('../../../view/messenger/Message');
const ViewChangeCity = require('../../../view/changeCity/ViewChangeCity');
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');
const userMutation = require('../../../helpers/graphql/user/mutation');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const accountMessenger = require(
  '../../../helpers/graphql/accountMessenger/mutation');
const config = require("../../../config");
const Sentry = require("@sentry/node");

class ChangeCity {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    const city = this.context.values.find(value => value.name === 'city');
    const changeCityMessage = new ViewChangeCity(this.user, this.event.locale);
    let messageArray = null;
    console.log('start change city');
    if (city) {
      this.apiGraphql.sendMutation(userMutation.updateCityTraveling(), {
        PSID: this.event.senderId,
        cityTraveling: city.value.toLowerCase()
      })
        .then(user => {
          console.log(user);
          messageArray = [ViewChatAction.markSeen(),
            ViewChatAction.typingOn(), ViewChatAction.typingOff(),
            changeCityMessage.cityChosen(city.value.toLowerCase()),
            ViewChatAction.typingOn(), ViewChatAction.typingOff(),
            changeCityMessage.cityMenu()];
          new Message(this.event.senderId, messageArray).sendMessage();
        })
        .catch(err => Sentry.captureException(err));
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