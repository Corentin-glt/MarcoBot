const i18n = require('i18n');
const Text = require('../messenger/Text');
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});


class ViewSubscribe {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  wouldYouSubOrUnsub() {
    return new Text(i18n.__("wouldYouSubOrUnsub"))
      .addQuickReply(`${i18n.__("subscribe")} 👍`, 'subscribe_subscription:true')
      .addQuickReply(`${i18n.__("unsubscribe")} 👎`, 'subscribe_subscription:false')
      .get();
  }

  subscribeMessage() {
    return new Text(i18n.__("subscribeMessage")).get();
  }

  unsubscribeMessage() {
    return new Text(`${i18n.__("unsubscribeMessage1")}\n\n\n${i18n.__(
      "unsubscribeMessage2")}`).get();
  }

  unsubscribeErrorMessage() {
    return new Text(i18n.__("unsubscribeMessageError")).get()
  }


}

module.exports = ViewSubscribe;