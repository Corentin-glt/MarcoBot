const async = require("async");
const i18n = require("i18n");
const Text = require('../messenger/Text');
const List = require('../messenger/List');

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
    this.typeOfVenue = typeOfVenue;
    this.list = new List();
    i18n.setLocale(this.locale);
  }

  firstMessage() {
    return new Text(
      i18n.__(`fetchRestaurantMessage`)
    )
      .get();
  }

  init() {
    return new Promise((resolve, reject) => {
      async.each(this.venues, (elem, callback) => {
        this.generateSubtitle(elem)
          .then(res => {
            const newElem = {
              ...elem,
              ...res
            }
            this.generateBubble(newElem)
          })
          .catch(err => callback(err))
      }, (err) => {
        if (err) reject(err);
        resolve(this.list.get())
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
      this.list
        .addBubble(`${elem.name}${globalNote}`,
          `${globalTypes}\n${elem.money}\n ${elem.schedule}`)
        .addImage(`https://api.marco-app.com/api/image/${elem.photos[0]}`)
        .addDefaultAction()
    })
  }
}

module.exports = Venue;
