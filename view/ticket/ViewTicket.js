/**
 * Created by corentin on 28/11/2018.
 */
const async = require("async");
const i18n = require("i18n");
const Text = require('../messenger/Text');
const Generic = require('../messenger/Generic');


i18n.configure({
  locales: ["en", "fr"],
  directory: __dirname + "/../../locales",
  defaultLocale: "en",
  cookie: "lang",
  register: global
});

class ViewTicket {
  constructor(locale, user) {
    this.locale = locale;
    this.user = user;
    this.generic = new Generic();
    i18n.setLocale(this.locale);
  }

  init(tickets) {
    this.tickets = tickets;
    return new Promise((resolve, reject) => {
      async.each(this.tickets, (elem, callback) => {
        return this.generateBubble(elem)
          .then(() => callback())
          .catch(err => callback(err))
      }, (err) => {
        if (err) return reject(err);
        this.showNextPageOrTalkingHuman();
        return resolve(this.generic.get())
      })
    })
  }

  generateBubble(affiliation) {
    return new Promise((resolve, reject) => {
      const kindElement = Object.keys(affiliation).find(item =>
      item.includes('s_id') && affiliation[item] !== null);
      let globalUrl = affiliation.url;
      globalUrl.includes('http://') ?
        globalUrl = globalUrl.split('http://').join('') : null;
      globalUrl.includes('https://') ? null :
        globalUrl = `https://${globalUrl}`;
      this.generic
        .addBubble(`${affiliation.name}`,
          `📍 ${affiliation[kindElement].location.name} \n${affiliation.price} €`)
        .addImage(
          `https://api.marco-app.com/api/image/${affiliation[kindElement].photos[0]}`)
        .addDefaultAction(`${affiliation.url}`)
        .addButton(i18n.__("buyShare"),
          `${globalUrl}`)
        .addShareButton(
          new Generic()
            .addBubble(`${affiliation.name}`,
              `📍 ${affiliation[kindElement].location.name} \n${affiliation.price} €`)
            .addImage(
              `https://api.marco-app.com/api/image/${affiliation[kindElement].photos[0]}`)
            .addDefaultAction(
              `https://www.messenger.com/t/meethellomarco?ref=share_card`)
            .addButton(i18n.__("buyShare"),
              `${globalUrl}`)
            .get()
        )
      resolve()
    })
  }

  emptyMessage(){
    return new Text(i18n.__("nothingStock"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__('eat'), 'eat')
      .addQuickReply(i18n.__('drink'), 'drink')
      .addQuickReply(i18n.__('chat'), 'talkingToHuman_isTalking:true')
      .get();
  }

  errorMessage() {
    return new Text(i18n.__("error"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__('eat'), 'eat')
      .addQuickReply(i18n.__('drink'), 'drink')
      .addQuickReply(i18n.__('chat'), 'talkingToHuman_isTalking:true')
      .get();
  }

  lastMessage() {
    return new Text(i18n.__("question1MessageAfterGeoLocation"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__("visit"), 'visit')
      .addQuickReply(i18n.__('eat'), 'eat')
      .addQuickReply(i18n.__('drink'), 'drink')
      .addQuickReply(i18n.__('chat'), 'talkingToHuman_isTalking:true')
      .get();
  }

  showNextPageOrTalkingHuman() {
    this.tickets.length === 5 ?
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
  }

}
module.exports = ViewTicket;