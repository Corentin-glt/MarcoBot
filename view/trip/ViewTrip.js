const i18n = require('i18n');
const Text = require('../messenger/Text');
const Button = require('../messenger/Button');
const Generic = require('../messenger/Generic');

i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});

const numberDayString = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
const numberDayStringFR = ['', 'premier', 'deuxième', 'troisième', 'quatrième',
  'cinquième'];

class ViewTrip {
  constructor(user, locale) {
    this.user = user;
    this.locale = locale;
    i18n.setLocale(locale);
  }

  firstTime(city) {
    return new Text(`${i18n.__("isItFirstTime")} ${i18n.__(city)} ?`)
      .addQuickReply("✅", 'trip_firstTime:true')
      .addQuickReply("❌", 'trip_firstTime:false')
      .get();
  }

  whenAreYouArriving(firstTime, city) {
    const textToReturn = firstTime ?
      `${i18n.__("whenAreYouArrivingPart1")}\n${i18n.__(
        "whenAreYouArrivingPart2")} \n\n${i18n.__(
        "whenAreYouArrivingPart3")} ${i18n.__(city)} ${i18n.__(
        "whenAreYouArrivingPart4")}\n\n${i18n.__(
        "whenAreYouArrivingPart5")}${i18n.__(city)}${i18n.__(
        "whenAreYouArrivingPart6")}` :
      `${i18n.__("whenAreYouArrivingPart7")} ${i18n.__(
        "whenAreYouArrivingPart2")} \n\n${i18n.__(
        "whenAreYouArrivingPart3")} ${i18n.__(city)}${i18n.__(
        "whenAreYouArrivingPart4")}\n\n${i18n.__(
        "whenAreYouArrivingPart5")}${i18n.__(city)}${i18n.__(
        "whenAreYouArrivingPart6")}`;
    return new Text(textToReturn)
      .addQuickReply(`${i18n.__("whenAreYouArrivingPart8")}${i18n.__(city)}`,
        'trip_arrival:alreadyHere')
      .get();

  }

  forgotCity() {
    return new Text(i18n.__("forgetCity")).get();
  }

  chooseCity() {
    return new Generic()
      .addBubble(`🇬🇧🇬🇧 ${i18n.__('london')} 🇬🇧🇬🇧`, '')
      .addImage(`https://api.marco-app.com/api/image/london.jpg`)
      .addButton(i18n.__("validate"), 'trip_city:london')
      .addBubble(`🇪🇸🇪🇸 ${i18n.__('barcelona')} 🇪🇸🇪🇸`, '')
      .addImage(`https://api.marco-app.com/api/image/barcelona.jpg`)
      .addButton(i18n.__("validate"), 'trip_city:barcelona')
      .addBubble(`🇫🇷🇫🇷 ${i18n.__('paris')} 🇫🇷🇫🇷`, '')
      .addImage(`https://api.marco-app.com/api/image/paris.jpg`)
      .addButton(i18n.__("validate"), 'trip_city:paris')
      .addBubble(`🇮🇹🇮🇹 ${i18n.__('rome')} 🇮🇹🇮🇹`, '')
      .addImage(`https://api.marco-app.com/api/image/roma.jpg`)
      .addButton(i18n.__("validate"), 'trip_city:rome')
      .get();
  }


  howManyDayAreStaying(city) {
    return new Text(
      `${i18n.__("howManyDayAreStaying1")} ${i18n.__(city)} ${i18n.__(
        "howManyDayAreStaying2")}`)
      .get();
  }

  isHereNow() {
    return new Text(i18n.__("isHereNow")).get();
  }

  arrivalLater() {
    return new Text(i18n.__("arrivalLater"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__('eat'), 'eat')
      .addQuickReply(i18n.__('drink'), 'drink')
      .addQuickReply(i18n.__('chat'), 'talkingToHuman_isTalking:true')
      .get();
  }

  itinerary(city, numberDay, programs_id) {
    const dayString = this.locale === 'fr' ? numberDayStringFR[numberDay] :
      numberDayString[numberDay];
     const itinerary = new Button(`${i18n.__("messageNotification")}${dayString}${i18n.__(
      "messageOfItineraryNotification2")}${i18n.__(city)}`)
      .addButton("Start ⚡️",
        `itinerary_program:${programs_id}_city:${city}_day:${parseInt(
          numberDay)}`);
    console.log(itinerary);
    return itinerary.template;

  }


}

module.exports = ViewTrip;

