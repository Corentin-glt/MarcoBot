const async = require("async");
const i18n = require("i18n");

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class Restaurant {
  constructor(locale, user) {
    this.locale = locale;
    this.user = user;
    i18n.setLocale(this.locale);
  }

  firstMessage(){
    return new Text(
      i18n.__(`fetchRestaurantMessage`)
    )
      .get();
  }
}

module.exports = Restaurant;
