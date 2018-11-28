/**
 * Created by corentin on 26/11/2018.
 */
const Generic = require("../messenger/Generic");
const Text = require("../messenger/Text");
const Button = require("../messenger/Button");
const async = require("async");
const i18n = require("i18n");

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class AroundMe {
  constructor(locale, user) {
    this.locale = locale;
    this.user = user;
    i18n.setLocale(this.locale);
  }

  emptyMessage() {
    return new Button(
      `${i18n.__("noAroundMe")}${i18n.__(this.user.cityTraveling)}${i18n.__(
        "noAroundMe2")}`)
      .addButton(i18n.__("switchCity"), 'changeCity')
      .get()
  }
  askLocation(){
    return new Text(i18n.__("preGeolocation"))
      .addQuickReplyLocation()
      .get()
  }
}

module.exports = AroundMe;