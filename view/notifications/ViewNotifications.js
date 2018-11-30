const Text = require("../messenger/Text");
const async = require("async");
const Button = require('../messenger/Button');
const i18n = require("i18n");
const numberDayString = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
const numberDayStringFR = ['', 'premier', 'deuxième', 'troisième', 'quatrième',
  'cinquième'];
i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});
class ViewNotifications {
  constructor(locale, user) {
    this.locale = locale;
    this.user = user;
    i18n.setLocale(this.locale);
  }

 groupInvitation(){
    console.log('GROUP INVITATION');
    return new Text(i18n.__("groupInvitation")).get();
 }

  itineraryNotification(city, numberDay, programs_id) {
    const cityToLowerCase = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToLowerCase.toLowerCase();
    const dayString = this.locale === 'fr' ? numberDayStringFR[numberDay] :
      numberDayString[numberDay];
    return new Button(`Hey ${this.user.firstName} 😊, ${i18n.__("messageOfItineraryNotification")}${dayString}${i18n.__(
      "messageOfItineraryNotification2")}${i18n.__(lowerCity)}`)
      .addButton("Start ⚡️",
        `itinerary_program:${programs_id}_city:${lowerCity}_day:${parseInt(
          numberDay)}`).get();
  }

  messageForTomorrow(name, city) {
    const cityToLowerCase = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToLowerCase.toLowerCase();
    return new Text(`Hey ${name}${i18n.__("messageForTomorrow")}${i18n.__(
      lowerCity)} ${i18n.__("messageForTomorrow2")}\n${i18n.__(
      "messageForTomorrow3")}`)
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__('visit'), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman_isTalking:true')
      .get();
  }

}
module.exports = ViewNotifications;