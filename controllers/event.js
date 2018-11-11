

class Event {
  constructor(event) {
    this.senderId = event.sender.id;
    this.message = event.message;
    this.locale = 'en';
  }

  set language(lang) {
    this.locale = lang;
  }

  handling(user) {
    console.log(user);
    // const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
    // const senderId = event.sender.id;
    // const queryAccount = accountMessenger.queryPSID(senderId);
    // apiGraphql.sendQuery(queryAccount)
    //   .then(response => {
    //     event.locale = response.accountMessenger.locale.split("_")[0];
    //     _checkReferral(event);
    //     if ((event.message && event.message.text && event.message.quick_reply)
    //       || (event.message && event.message.attachements)
    //       || (event.postback)
    //     ) {
    //       checkEvents(event)
    //     } else {
    //       checkNlp(event)
    //     }
    //   })
    //   .catch(err => {
    //     Sentry.captureException(err)
    //   });
  }

  sendReferral() {


  }


}

module.exports = Event;