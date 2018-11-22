const i18n = require('i18n');
const Text = require('../messenger/Text');
const Button = require('../messenger/Button');
const Image = require('../messenger/Image');
const Generic = require('../messenger/Generic');

i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});

class ViewMap {
  constructor(user, locale) {
    this.user = user;
    this.locale = locale;
    i18n.setLocale(locale);
  }

  showMap(locationsGoogleMap) {
    return new Button(i18n.__("sendLocation"))
      .addButton(i18n.__("clickHere"), `https://www.google.com/maps/${locationsGoogleMap}`)
      .get();
  }

  mapMenu() {
    return new Text(i18n.__('question1MessageAfterGeoLocation'))
      .addQuickReply(i18n.__("next"), 'next')
      .addQuickReply(`📃 Menu`, 'menu')
      .get()
  }
}

module.exports = ViewMap;