const i18n = require('i18n');
const Text = require('../messenger/Text');
const Generic = require('../messenger/Generic');
i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});


class ViewDefault {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  startDefault() {
    return new Text(i18n.__("startDefault"))
      .addQuickReply(i18n.__("excitementRep1"), 'start_isOk:true')
      .addQuickReply(i18n.__("excitementRep2"), 'start_isOk:false')
      .get();
  }

  tripCityDefault1() {
    return new Text(i18n.__("tripCityDefault1"))
  }

  tripCityDefault2() {
    new Generic()
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

  firstTimeDefault() {
    return new Text(i18n.__('firstTimeDefault'))
      .addQuickReply("✅", 'trip_firstTime:true')
      .addQuickReply("❌", 'trip_firstTime:false')
      .get();
  }

  arrivalDefault() {
    return new Text(i18n.__('arrivalDefault')).get()
  }

  departureDefault() {
    return new Text(i18n.__('departureDefault')).get();
  }

  itineraryDefault() {
    return new Text("itineraryDefault")
      .addQuickReply(i18n.__("next"), 'next')
      .addQuickReply(i18n.__("stepMap"), `map_location:${locationsGoogleMap}`)
      .addQuickReply(`📃 Menu`, 'menu')
      .get();
  }

  menuDefault() {
    return new Text(i18n.__("menuDefault"))
      .addQuickReply(i18n.__("geolocation"), 'aroundMe')
      .addQuickReply(i18n.__('ticketing'), 'ticket')
      .addQuickReply(i18n.__('visit'), 'visit')
      .addQuickReply(i18n.__("eat"), 'eat')
      .addQuickReply(i18n.__("drink"), 'drink')
      .addQuickReply(i18n.__("chat"), 'talkingToHuman_isTalking:true')
      .get();
  }

  eatCategoryDefault() {
    return new Text("categoryDefault");
  }

  drinkCategoryDefault() {
    return new Text("categoryDefault")
  }

  visitCategoryDefaul() {
    return new Text("categoryDefault")
  }


  descriptionDefault() {
    return new Text("descriptionDefault");
  }

}

module.exports = ViewDefault;

