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


class ViewHelp {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  helpmessage() {
    return new Text(`${i18n.__("helpMessage1")}\n${i18n.__(
      "helpMessage2")}\n\n${i18n.__("helpMessage3")}`).get();
  }

  startTalkingWithHumanHelp() {
    return new Generic()
      .addBubble(i18n.__("startTalkingWithHumanHelp"), i18n.__("startTalkingWithHumanHelp2"))
      .addButton('Stop chat', 'talkingToHuman_isTalking:false')
      .get();
  }

}

module.exports = ViewHelp;

