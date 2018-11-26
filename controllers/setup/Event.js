const ApiReferral = require('../../helpers/Api/apiReferral');
const Messenger = require('../messenger/Messenger');
const Nlp = require('../nlp/Nlp');


class Event {
  constructor(event) {
    this.senderId = event.sender.id;
    this.message = event.message;
    this.locale = 'en';
    this.referral = event.referral;
    this.postback = event.postback;
    this.recipientId = event.recipient.id;
  }

  set language(lang) {
    this.locale = lang;
  }

  checkReferral() {
    if (this.referral ||
      (typeof this.postback !== "undefined" && this.postback.referral)) {
      this.referral = this.referral || this.postback.referral;
      const nameReferral = this.referral.source === "DISCOVER_TAB" ?
        'Discovery' : this.referral.ref;
      ApiReferral.sendReferral(nameReferral, this.senderId);
    }
  }

  handling(user) {
    this.checkReferral();
    if ((this.message && this.message.text && this.message.quick_reply)
      || (this.message && this.message.attachments)
      || (this.postback)
    ) {
      const messenger = new Messenger(this);
      messenger.handle();
    } else {
      const nlp = new Nlp(this);
      nlp.handle(user);
    }
  }

}

module.exports = Event;