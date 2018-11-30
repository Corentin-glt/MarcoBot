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


class ViewStart {
  constructor(user, locale) {
    this.user = user;
    i18n.setLocale(locale);
  }

  initMessage() {
    return new Text(
      i18n.__('initialMessage') + `${this.user.firstName} ! 👋 \n` +
      i18n.__('initialMessageBis'))
      .get();
  }

  problemMessage() {
    return new Text(
      i18n.__('initialMessage2')
    ).get();
  }

  whatMessage() {
    return new Text(
      i18n.__('initialMessage3')
    ).get();
  }

  excitementMessage() {
    return new Text(i18n.__("excitementMessage"))
      .addQuickReply(i18n.__("excitementRep1"), 'start_isOk:true')
      .addQuickReply(i18n.__("excitementRep2"), 'start_isOk:false')
      .get();
  }

  excitementConfirm1() {
    return new Text(i18n.__("experienceMessage")).get();
  }

  excitementConfirm2() {
    return new Text(i18n.__("missionMessage2")).get();
  }

  excitementConfirm3() {
    return new Text(i18n.__("whichCity")).get();
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

  excitementCancel1() {
    return new Text(i18n.__("noNeedMessage")).get()
  }

  excitementCancel2() {
    return new Text(i18n.__("preFeedback")).get();
  }

  excitementFeedback() {
    return new Text(i18n.__(i18n.__("feedbackInput"))).get();
  }

}

module.exports = ViewStart;