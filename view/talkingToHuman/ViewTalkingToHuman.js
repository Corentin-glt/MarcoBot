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


class ViewTalkingToHuman {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

 startTalking() {
    return new Generic()
      .addBubble(i18n.__("startTalkingWithHuman"), i18n.__("startTalkingWithHuman2Bis"))
      .addButton("Stop chat", 'talkingToHuman_isTalking:false')
      .get();
 }

 menu() {
    return new Text(i18n.__("stopTalkingWithHuman"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman_isTalking:true')
      .get();
 }

}

module.exports = ViewTalkingToHuman;