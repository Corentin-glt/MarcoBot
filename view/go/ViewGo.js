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
      .addQuickReply(i18n.__("rememberLocationNo"), 'go_rememberLocation:false')
      .get()
  }

  updateLocation() {
    const updateText = new Text(i18n.__("updateLocation"));
    return updateText
      .addQuickReplyLocation()
      .addQuickReply("👎", 'go_updateLocation:false')
      .get()
  }

  askLocation() {
    const updateText = new Text(i18n.__("askLocation"));
    return updateText
      .addQuickReplyLocation()
      .addQuickReply("👎", 'go_updateLocation:false')
      .get()
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

  sendLocation(place, event) {
    const elemLocationGoogleMap = place.replace(" ", "+");
    const locationButton = new Button(i18n.__("sendLocation"));
    return locationButton
      .addButton(`📍 ${event}`,
        `https://www.google.fr/maps/place/${elemLocationGoogleMap}`)
      .get();
  }

  noItinerary(eventName) {
    return new Text(
      `${i18n.__("noLocationEvent")} ${eventName}${i18n.__(
        "noLocationEvent2")}`
    )
      .get()
  }

  sendAddress(eventAddress) {
    return new Text(
      `📍 ${eventAddress}`
    )
      .get()
  }

  finaleMessage(){
    return new Text(i18n.__("question1MessageAfterDistrict"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__("ticketing"), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman')
      .get()
  }

  errorMessage(){
    return new Text(i18n.__("wrongContext"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__("ticketing"), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman')
      .get()
  }

}

module.exports = Go;