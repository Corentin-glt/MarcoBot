const i18n = require('i18n');
const Text = require('../messenger/Text');
const QuickReply = require('../messenger/Template')
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});


class ViewStart {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  initMessage() {
    return new Text(
      i18n.__('initialMessage') + `${this.user.firstName} ! 👋 \n` +
      i18n.__('initialMessageBis'))
      .get();
  }

  problemMessage() {
    return new Text(
      i18n.__('initialMessage2')
    ).get();
  }

  whatMessage() {
    return new Text(
      i18n.__('initialMessage3')
    ).get();
  }

  excitementMessage() {
    return new Text(i18n.__("excitementMessage"))
      .addQuickReply(i18n.__("excitementRep1"), 'start_isOk:true')
      .addQuickReply(i18n.__("excitementRep2"), 'start_isOk:false')
      .get();
  }




}

module.exports = ViewStart;