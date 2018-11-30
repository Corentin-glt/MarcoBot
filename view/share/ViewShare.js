/**
 * Created by corentin on 29/11/2018.
 */
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


class ViewMenu {
  constructor(locale, user) {
    this.user = user;
    this.locale = locale;
    i18n.setLocale(locale);
  }

  init() {
    return new Generic()
      .addBubble('Marco', i18n.__("shareSubtitle"))
      .addImage(`https://api.marco-app.com/api/image/marcoSharePhoto.jpg`)
      .addShareButton(
        new Generic()
          .addBubble("Marco", i18n.__("shareSubtitle"))
          .addButton(i18n.__("shareButton"),
            "https://m.me/meethellomarco?ref=share")
          .get()
      )
      .get();
  }

  finalMessage() {
    return new Text(
      `${i18n.__('thanksToShare1')}${this.user.firstName}${i18n.__(
        'thanksToShare2')}`)
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__('visit'), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman_isTalking:true')
      .get();
  }

}

module.exports = ViewMenu;