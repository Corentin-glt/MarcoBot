/**
 * Created by corentin on 26/11/2018.
 */
const Text = require("../messenger/Text");
const async = require("async");
const i18n = require("i18n");

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});


class ViewLater {
  constructor(locale, user) {
    this.locale = locale;
    this.user = user;
    i18n.setLocale(this.locale);
  }

  saveIt() {
    return new Text(i18n.__("saveLater"))
      .get()
  }

  finalMessage() {
    return new Text(i18n.__("question1MessageAfterLater"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__("ticketing"), 'ticketing')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman')
      .get()
  }

  errorMessage(){
    return new Text(i18n.__("wrongContext"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__("ticketing"), 'ticketing')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman')
      .get()
  }
}

module.exports = ViewLater;