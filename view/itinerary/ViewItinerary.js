const i18n = require('i18n');
const Text = require('../messenger/Text');
const Button = require('../messenger/Button');
const Image = require('../messenger/Image');
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

class ViewItinerary {
  constructor(user, locale) {
    this.user = user;
    this.locale = locale;
    i18n.setLocale(locale);
  }

  sendPhotoItinerary(photo) {
    return new Image(`https://api.marco-app.com/api/image/${photo}`).get();
  }

  itineraryNotifications(description, locationsGoogleMap) {
    console.log(description);
    return new Text(description)
      .addQuickReply(i18n.__("next"), 'next')
      .addQuickReply(i18n.__("stepMap"), `map_location:${locationsGoogleMap}`)
      .addQuickReply(`📃 Menu`, 'menu')
      .get();
  }

  textBeforeShare(url) {
    return new Text(`${i18n.__("textBeforeShare")}${url}\n\n${i18n.__("textBeforeShare3")}`).get();
  }

  shareOrFindUrlMedium() {
    return new Generic()
      .addBubble(i18n.__("shareUrlTitle"), i18n.__("helpMessage2"))
      .addImage("https://api.marco-app.com/api/image/marcoSharePhoto.jpg")
      .addShareButton(new Generic()
        .addBubble(`Share`, i18n.__("helpMessage2"))
        .addImage(`https://api.marco-app.com/api/image/marcoSharePhoto.jpg`)
        .addDefaultAction("https://www.messenger.com/t/meethellomarco?ref=share")
        .addButton(i18n.__("shareUrlButton"), `https://www.messenger.com/t/marco.bot.paris`)
        .get()
      )
      .get();
  }

}

module.exports = ViewItinerary;