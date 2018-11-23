/**
 * Created by corentin on 23/11/2018.
 */
const async = require("async");
const i18n = require("i18n");
const Text = require('../messenger/Text');
const Button = require('../messenger/Button');

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class Go {
  constructor(locale, user, typeOfVenue) {
    this.locale = locale;
    this.user = user;
    this.typeOfVenue = typeOfVenue.toLowerCase();
    i18n.setLocale(this.locale);
  }

  rememberLocation() {
    const rememberText = new Text(i18n.__("rememberLocation"));
    return rememberText
      .addQuickReplyLocation()
      .addQuickReply(i18n.__("rememberLocationNo"), 'go_rememberLocation:true')
      .get()
  }

  updateLocation() {
    const updateText = new Text(i18n.__("updateLocation"));
    return updateText
      .addQuickReplyLocation()
      .addQuickReply("👎", 'go_updateLocation:false')
  }

  letsGoMessage() {
    return new Text(
      i18n.__("letsGoMessage")
    )
      .get();
  }

  sendItinerary(destination) {
    const itineraryButton = new Button(i18n.__("sendItinerary"));
    return itineraryButton
      .addButton(i18n.__("itinerary2"),
        `https://www.google.com/maps/dir/${this.user.geoLocation.lat},${this.user.geoLocation.lng}/${destination.lat},${destination.lng}/`)
      .get();
  }

  sendLocation(destination, event) {
    const locationButton = new Button(i18n.__("sendLocation"));
    return locationButton
      .addButton(`📍 ${event}`,
        `https://www.google.com/maps/dir//${destination.lat},${destination.lng}/`)
      .get();
  }

}

module.exports = Go;