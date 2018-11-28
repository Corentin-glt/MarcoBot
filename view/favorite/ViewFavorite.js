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


class ViewFavorite {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  nothing() {
    return new Text(i18n.__("nothingFavorite"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__('eat'), 'eat')
      .addQuickReply(i18n.__('drink'), 'drink')
      .addQuickReply(i18n.__('chat'), 'talkingToHuman_isTalking:true')
      .get();
  }
}

module.exports = ViewFavorite;

