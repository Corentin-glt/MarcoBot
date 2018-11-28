const async = require("async");
const i18n = require("i18n");
const Text = require('../messenger/Text');
const Generic = require('../messenger/Generic');
const ARRAYDAY = ["sunday", "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday"];
const anecdotes = require('../../assets/variableApp/anecdotes/index');

i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class Venue {
  constructor(locale, user, venues, typeOfVenue, isDifferentVenue) {
    this.locale = locale;
    this.user = user;
    this.venues = venues;
    this.typeOfVenue = typeOfVenue.toLowerCase();
    this.isDifferentVenue = isDifferentVenue;
    this.generic = new Generic();
    i18n.setLocale(this.locale);
  }

  firstMessage() {
    let messageToSend = '';
    if (this.typeOfVenue === "restaurant") {
      messageToSend = i18n.__(`fetchRestaurantMessage`)
    } else if (this.typeOfVenue === "bar") {
      messageToSend = i18n.__(`fetchBarsMessage`)
    } else if (this.typeOfVenue === "visit"){
      messageToSend = i18n.__(`fetchVisitMessage`)
    } else {
      messageToSend = i18n.__(`aroundMeChoice`)
    }
    return new Text(messageToSend).get();
  }

  emptyVenuesMessage() {
    let payloadBackCategory = '';
    let payloadBackPrice = '';
    if (this.typeOfVenue === "restaurant") {
      payloadBackCategory = 'back_event:eat_option:category';
      payloadBackPrice = 'back_event:eat_option:price';
    } else if (this.typeOfVenue === "bar") {
      payloadBackCategory = 'back_event:drink_option:category';
      payloadBackPrice = 'back_event:drink_option:price';
    } else if (this.typeOfVenue === "visit") {
      payloadBackCategory = 'back_event:visit_option:category';
    }
    const arrayAnecdotes = anecdotes(this.user.cityTraveling, this.locale);
    const indexJoke = Math.floor(Math.random() *
      Math.floor(arrayAnecdotes.length - 1));
    const textEmpty = new Text(`${i18n.__("jokeMarco1")}\n${i18n.__(
      "jokeMarco2")}\n${arrayAnecdotes[indexJoke]}`);
    textEmpty
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticketing')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman');
    payloadBackCategory !== "" ?
      textEmpty
        .addQuickReply(i18n.__("changeCategory"), payloadBackCategory)
      : null;
    payloadBackPrice !== "" ?
      textEmpty
        .addQuickReply(i18n.__("changePrice"), payloadBackPrice)
      :
      null;
    return textEmpty.get();
  }

  init() {
    return new Promise((resolve, reject) => {
      async.each(this.venues, (elem, callback) => {
        console.log('YOLO A-0');
        this.generateSubtitle(elem)
          .then(res => {
            console.log('YOLO B - 0');
            const newElem = {
              ...elem,
              ...res
            };
            return this.generateBubble(newElem)
          })
          .then(() => callback())
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
      console.log('YOLO A-1');
      let schedule = "🕐 ";
      const daySchedule = (elem.schedule &&
      elem.schedule[ARRAYDAY[nowMoment.getDay()]] !== null) ?
        elem.schedule[ARRAYDAY[nowMoment.getDay()]] : [];
      console.log('YOLO A-2');
      if (daySchedule.length > 0) {
        console.log('YOLO A-3');
        daySchedule.map((day, i) => {
          console.log('YOLO A-4');
          schedule = (day.start === "12:00 am" && day.end === "12:00 pm") ?
            schedule.concat(i18n.__("templateOpen"))
            : schedule.concat(day.start, ' - ', day.end, ' ');
          if (i === daySchedule.length - 1) {
            console.log('YOLO A-5');
            resolve({schedule: schedule, money: money});
          }
        })
      } else {
        console.log('YOLO A-6');
        schedule = i18n.__("templateClose");
        resolve({schedule: schedule, money: money});
      }
    })
  }


  generateBubble(elem) {
    console.log('ELEM ==>', elem);
    return new Promise((resolve, reject) => {
      const elemLocationGoogleMap = elem.location.name.replace(" ", "+");
      const globalNote = elem.note && elem.note !== null &&
      typeof elem.note !== 'undefined' ?
        `🌟${elem.note}` : '';
      let globalTypes = '';
      elem.types.map((elem, index) => {
        index === 0 ? globalTypes = `${elem}`
          : globalTypes = `${globalTypes}, ${elem}`
      });
      globalTypes.length > 30 ? globalTypes = globalTypes.slice(0, 30) + '...'
        : null;
      console.log('YOLO B - 1');
      let globalUrl = elem.url;
      globalUrl.includes('http://') ?
        globalUrl = globalUrl.split('http://').join('') : null;
      globalUrl.includes('https://') ? null :
        globalUrl = `https://${globalUrl}`;
      console.log('YOLO B - 2');
      let description = `${globalTypes}\n${elem.money}\n ${elem.schedule}`;
      description.length > 80 ? description = description.slice(0, 75) + '...'
        : null;
      console.log('YOLO B - 3');
      let subtitleSharing = `📍 ${elem.location.name} \n${elem.money}\n ${elem.schedule}`
      subtitleSharing.length > 80 ?
        subtitleSharing = subtitleSharing.slice(0, 75) + '...'
        : null;
      console.log('YOLO B - 4');
      const kindElement = this.isDifferentVenue ?
         elem.kindElement : this.typeOfVenue ;
      console.log('YOLO B - 5');
      this.generic
        .addBubble(`${elem.name}${globalNote}`, description)
        .addImage(`https://api.marco-app.com/api/image/${elem.photos[0]}`)
        .addDefaultAction(`${globalUrl}`)
        .addButton(i18n.__("letsGo"),
          `go_event:${kindElement}_id:${elem.id || elem._id}`)
        .addShareButton(
          new Generic()
            .addBubble(`${elem.name}`, subtitleSharing)
            .addImage(`https://api.marco-app.com/api/image/${elem.photos[0]}`)
            .addDefaultAction(
              `https://www.messenger.com/t/meethellomarco?ref=share_card`)
            .addButton(i18n.__("whereShare"),
              `https://www.google.fr/maps/place/${elemLocationGoogleMap}`)
            .get()
        );
      console.log('YOLO B - 6');
      if (elem.affiliations!== null && elem.affiliations.length > 0 ) {
        console.log('YOLO B - 7-1');
        this.generic.addButton(i18n.__("reservationTemplate"),
          `${elem.affiliations[0].url}`)
        console.log('YOLO B - 7-2');
      } else {
        console.log('YOLO B - 8-1');
        (elem.description.length > 0 &&
        this.locale !== 'fr')
        || (elem.descriptionFr.length > 0 && this.locale === 'fr') ?
          this.generic.addButton(i18n.__("tellMore"),
            `description_event:${kindElement}_id:${elem.id || elem._id}`)
          :
          this.generic.addButton(i18n.__("tellMore"),
            `${globalUrl}`)
        console.log('YOLO B - 8 - 2');
      }
      resolve()
    })
  }

  showNextPageOrTalkingHuman() {
    console.log('YOLO B - 9');
    this.venues.length === 5 ?
      this.generic
        .addBubble(i18n.__("seeMore"), i18n.__("seeMoreSub"))
        .addImage(`https://api.marco-app.com/api/image/FBProfileRe.png`)
        .addButton(i18n.__("seeMoreButton"), 'next')
      :
      this.generic
        .addBubble(i18n.__("nothingStock"), i18n.__("nothingStockSub"))
        .addImage(`https://api.marco-app.com/api/image/askInformation.jpg`)
        .addButton(i18n.__("nothingStockButton"),
          'talkingToHuman_isTalking:true')
    console.log('YOLO B - 10');
  }
}

module.exports = Venue;
