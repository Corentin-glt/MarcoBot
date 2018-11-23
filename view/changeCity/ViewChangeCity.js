const i18n = require('i18n');
const Text = require('../messenger/Text');
const Generic = require('../messenger/Generic');
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});


class ViewChangeCity {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  changeCityMessage() {
    return new Text(i18n.__(
      "yourCityActual")).get();
  }

  changeCity() {
    return new Generic()
      .addBubble(`🇬🇧🇬🇧 ${i18n.__('london')} 🇬🇧🇬🇧`, '')
      .addImage(`https://api.marco-app.com/api/image/london.jpg`)
      .addButton(i18n.__("validate"), 'changeCity_city:london')
      .addBubble(`🇪🇸🇪🇸 ${i18n.__('barcelona')} 🇪🇸🇪🇸`, '')
      .addImage(`https://api.marco-app.com/api/image/barcelona.jpg`)
      .addButton(i18n.__("validate"), 'changeCity_city:barcelona')
      .addBubble(`🇫🇷🇫🇷 ${i18n.__('paris')} 🇫🇷🇫🇷`, '')
      .addImage(`https://api.marco-app.com/api/image/paris.jpg`)
      .addButton(i18n.__("validate"), 'changeCity_city:paris')
      .addBubble(`🇮🇹🇮🇹 ${i18n.__('rome')} 🇮🇹🇮🇹`, '')
      .addImage(`https://api.marco-app.com/api/image/roma.jpg`)
      .addButton(i18n.__("validate"), 'changeCity_city:rome')
      .get();
  }

  cityChosen(city) {
    return new Text(`${i18n.__("updateCityDone")} ${i18n.__(city)} ✅`).get();
  }

  cityMenu() {
    return new Text(i18n.__("question1Message"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__('visit'), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman_isTalking:true')
      .get();
  }
}

module.exports = ViewChangeCity;

