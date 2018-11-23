const async = require("async");
const i18n = require("i18n");
const Text = require('../messenger/Text');
const Generic = require('../messenger/Generic');
const ARRAYDAY = ["sunday", "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday"];

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class Venue {
  constructor(locale, user, venues, typeOfVenue) {
    this.locale = locale;
    this.user = user;
    this.venues = venues;
    this.typeOfVenue = typeOfVenue.toLowerCase();
    this.generic = new Generic();
    i18n.setLocale(this.locale);
  }

  firstMessage() {
    let messageToSend = '';
    if (this.typeOfVenue === "restaurant") {
      messageToSend = i18n.__(`fetchRestaurantMessage`)
    } else if (this.typeOfVenue === "bar") {
      messageToSend = i18n.__(`fetchBarsMessage`)
    } else {
      messageToSend = i18n.__(`fetchVisitMessage`)
    }
    return new Text(messageToSend).get();
  }

  emptyVenuesMessage(){
    let messageToSend = '';
    if (this.typeOfVenue === "restaurant") {
      messageToSend = i18n.__(`fetchRestaurantMessage`)
    } else if (this.typeOfVenue === "bar") {
      messageToSend = i18n.__(`fetchBarsMessage`)
    } else {
      messageToSend = i18n.__(`fetchVisitMessage`)
    }
  }

  init() {
    return new Promise((resolve, reject) => {
      async.each(this.venues, (elem, callback) => {
        this.generateSubtitle(elem)
          .then(res => {
            const newElem = {
              ...elem,
              ...res
            };
            this.generateBubble(newElem)
              .then(() => callback())
              .catch(err => callback(err))
          })
          .catch(err => callback(err))
      }, (err) => {
        if (err) return reject(err);
        this.showNextPageOrTalkingHuman();
        return resolve(this.generic.get())
      })
    })
  }

  generateSubtitle(elem) {
    const nowMoment = new Date();
    return new Promise((resolve, reject) => {
      let money = "";
      switch (elem.priceRange) {
        case 0:
          money = i18n.__("templatePrice");
          break;
        case 1:
          money = "💰";
          break;
        case 2:
          money = "💰💰";
          break;
        case 3:
          money = "💰💰";
          break;
        case 4:
          money = "💰💰💰";
          break;
        default:
          money = i18n.__("templatePrice");
          break;
      }
      let schedule = "🕐 ";
      const daySchedule = (elem.schedule &&
      elem.schedule[ARRAYDAY[nowMoment.getDay()]] !== null) ?
        elem.schedule[ARRAYDAY[nowMoment.getDay()]] : [];
      if (daySchedule.length > 0) {
        daySchedule.map((day, i) => {
          schedule = (day.start === "12:00 am" && day.end === "12:00 pm") ?
            schedule.concat(i18n.__("templateOpen"))
            : schedule.concat(day.start, ' - ', day.end, ' ');
          if (i === daySchedule.length - 1) {
            resolve({schedule: schedule, money: money});
          }
        })
      } else {
        schedule = i18n.__("templateClose");
        resolve({schedule: schedule, money: money});
      }
    })
  }


  generateBubble(elem) {
    return new Promise((resolve, reject) => {
      const elemLocationGoogleMap = elem.location.name.replace(" ", "+");
      const globalNote = elem.note && elem.note !== null &&
      typeof elem.note !== 'undefined' ?
        `🌟${elem.note}` : '';
      let globalTypes = '';
      elem.types.map((elem, index) => {
        index === 0 ?
          globalTypes = `${elem}`
          :
          globalTypes = `${globalTypes}, ${elem}`
      });
      globalTypes.length > 30 ?
        globalTypes = globalTypes.slice(0, 30) + '...'
        : null;
      let globalUrl = elem.url;
      globalUrl.includes('http://') ?
        globalUrl = globalUrl.split('http://').join('') : null;
      globalUrl.includes('https://') ? null :
        globalUrl = `https://${globalUrl}`;
      this.generic
        .addBubble(`${elem.name}${globalNote}`,
          `${globalTypes}\n${elem.money}\n ${elem.schedule}`)
        .addImage(`https://api.marco-app.com/api/image/${elem.photos[0]}`)
        .addDefaultAction(`${globalUrl}`)
        .addButton(i18n.__("letsGo"),
          `go_event:${this.typeOfVenue}_id:${elem.id || elem._id}`)
        .addShareButton(
          new Generic()
            .addBubble(`${elem.name}`,
              `📍 ${elem.location.name} \n${elem.money}\n ${elem.schedule}`)
            .addImage(`https://api.marco-app.com/api/image/${elem.photos[0]}`)
            .addDefaultAction(
              `https://www.messenger.com/t/meethellomarco?ref=share_card`)
            .addButton(i18n.__("whereShare"),
              `https://www.google.fr/maps/place/${elemLocationGoogleMap}`)
            .get()
        )
      if (elem.affiliations.length > 0) {
        this.generic
          .addButton(i18n.__("reservationTemplate"),
            `${elem.affiliations[0].url}`)
      } else {
        (elem.description.length > 0 &&
        this.locale !== 'fr')
        || (elem.descriptionFr.length > 0 && this.locale === 'fr') ?
          this.generic.addButton(i18n.__("tellMore"),
            `description_event:${this.typeOfVenue}_id:${elem.id || elem._id}`)
          :
          this.generic.addButton(i18n.__("tellMore"),
            `${globalUrl}`)
      }
      resolve()
    })
  }

  showNextPageOrTalkingHuman(){
    this.venues.length === 5 ?
      this.generic
        .addBubble(i18n.__("seeMore"), i18n.__("seeMoreSub"))
        .addImage(`https://api.marco-app.com/api/image/FBProfileRe.png`)
        .addButton(i18n.__("seeMoreButton"), 'next')
      :
      this.generic
        .addBubble( i18n.__("nothingStock"), i18n.__("nothingStockSub"))
        .addImage(`https://api.marco-app.com/api/image/askInformation.jpg`)
        .addButton(i18n.__("nothingStockButton"), 'talkingToHuman_isTalking:true')
  }
}

module.exports = Venue;
