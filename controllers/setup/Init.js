const Event = require('./Event');
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const config = require('../../config');
const accountQuery = require('../../helpers/graphql/accountMessenger/query');
const userQuery = require('../../helpers/graphql/user/query');
const User = require('../identification/User');
const Account = require("../identification/Account");
const apiMessenger = require('../../helpers/Api/apiMessenger');
const Sentry = require('@sentry/node');



class Init {
  constructor(entry) {
    this.entry = entry;
  }

  handleEntry() {
    this.entry.forEach(item => {
      item.messaging.forEach(event => {
        const mainEvent = new Event(event);
        const apiGraphql = new ApiGraphql(
          config.category[config.indexCategory].apiGraphQlUrl,
          config.accessTokenMarcoApi);
        apiGraphql.sendQuery(accountQuery.queryPSID(mainEvent.senderId))
          .then(res => {
            if (res.accountMessenger === null) {
             this.handleCreation(mainEvent);
            } else {
              this.handleGet(mainEvent, res)
            }
          })
          .catch((err) => Sentry.captureException(err));
      })
    })

  }

  handleCreation(event) {
    apiMessenger.receiveProfileFacebook(event.senderId)
      .then(res => {
        if (res.data) {
          const account = new Account(event.senderId, res.data.locale, res.data.timezone);
          const user = new User(event.senderId,
            res.data.first_name, res.data.last_name,
            res.data.gender,
            res.data.profile_pic);
          account.createAccount()
            .then(response => {
              if (response) {
                event.language = account.locale.split("_")[0];
                return user.createUser(response.id)
              }
            })
            .then(res => {
              user.isTalkingToHuman = res.isTalkingToHuman;
              event.handling(user);
            })
            .catch((err) => Sentry.captureException(err));
        }
      })
      .catch((err) => Sentry.captureException(err));
  }

  handleGet(event, res) {
    const account = new Account(res.accountMessenger.PSID, res.accountMessenger.locale.split("_")[0], res.accountMessenger.timezone);
    event.language = account.locale;
    const apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi);
    apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(account.PSID))
      .then(res => {
        const dbUser = res.userByAccountMessenger;
        const user = new User(dbUser.PSID, dbUser.firstName,
          dbUser.lastName, dbUser.gender, dbUser.profilePic);
        user.isTalkingToHuman = dbUser.isTalkingToHuman;
        event.handling(user);
      })
      .catch((err) => Sentry.captureException(err));
  }


}

module.exports = Init;
