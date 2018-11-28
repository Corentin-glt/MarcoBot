/**
 * Created by corentin on 23/11/2018.
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

class Description {
  constructor(locale, typeOfVenue, user, venue) {
    this.locale = locale;
    this.typeOfVenue = typeOfVenue;
    this.user = user;
    this.venue = venue;
    i18n.setLocale(this.locale);
  }

  init() {
    return new Promise((resolve, reject) => {
      const description = this.locale.includes('fr') ?
        this.venue.descriptionFr : this.venue.description;
      const text = new Text(description);
      text.addQuickReply(i18n.__("viewMore1"),
        `go_event:${this.typeOfVenue}_id:${this.venue.id || this.venue._id}`)
        .addQuickReply(i18n.__("viewMore2"),
          `later_event:${this.typeOfVenue}_id:${this.venue.id ||
          this.venue._id}`);
      resolve(text.get())
    })
  }
}
module.exports = Description;