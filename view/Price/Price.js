const priceIndex = require("./prices/index");
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

class Price {
  constructor(locale, venueOfPrice, user) {
  this.locale = locale;
  this.venueOfPrice = venueOfPrice;
  this.user = user;
  this.prices = priceIndex(this.venueOfPrice);
  i18n.setLocale(this.locale);
}

  init() {
    return new Promise((resolve, reject) => {
      const whichText =
        this.venueOfPrice === "eat"
          ? i18n.__("priceMessage1")
          : i18n.__("priceMessage2");
      const quickReplyMessage = new Text(whichText);
      async.each(this.prices, (price, callback) => {
        quickReplyMessage.addQuickReply(price.title, price.payload);
        callback();
      }, (err) => {
        if(err) reject(err);
        resolve(quickReplyMessage.get());
      });
    });
  }
}

module.exports = Price;
