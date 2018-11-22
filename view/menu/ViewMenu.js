const i18n = require('i18n');
const Text = require('../messenger/Text');

i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});


class ViewMenu {
  constructor(user, locale) {
    this.user = user;
    this.locale = locale;
    i18n.setLocale(locale);
  }

  menu() {
    return new Text(i18n.__("seeMenu"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__('visit'), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman')
      .get();
  }

}

module.exports = ViewMenu;