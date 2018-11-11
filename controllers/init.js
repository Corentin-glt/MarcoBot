const Event = require('./event');
const ApiGraphql = require('../helpers/Api/apiGraphql');
const config = require('../config');
const accountQuery = require('../graphql/accountMessenger/query');
const userQuery = require('../graphql/user/query');
const User = require('./user');
const Account = require("./account");

const apiMessenger = require('../helpers/Api/apiMessenger');


class Init {
  constructor(entry) {
    this.entry = entry;
  }

  handleEntry() {
    console.log("entry");
    this.entry.forEach(item => {
      item.messaging.forEach(event => {
        const mainEvent = new Event(event);
        const apiGraphql = new ApiGraphql(
          config.category[config.indexCategory].apiGraphQlUrl,
          config.accessTokenMarcoApi);
        apiGraphql.sendQuery(accountQuery.queryPSID(mainEvent.senderId))
          .then(res => {
            if (res.accountMessenger === null) {
              apiMessenger.receiveProfileFacebook(mainEvent.senderId)
                .then(res => {
                  if (res.data) {
                    const account = new Account(mainEvent.senderId, res.data.locale, res.data.timezone);
                    const user = new User(mainEvent.senderId,
                      res.data.first_name, res.data.last_name,
                      res.data.gender,
                      res.data.profile_pic);
                    account.createAccount()
                      .then(accountMessenger => {
                        if (accountMessenger) {
                          mainEvent.language = accountMessenger.locale.split("_")[0];
                          return user.createUser(accountMessenger)
                        }
                      })
                      .then(() => {
                        mainEvent.handling(user);
                      })
                      .catch(err => console.log(err));
                  }
                })
                .catch(err => console.log(err));
            } else {

              const account = new Account(res.accountMessenger.PSID, res.accountMessenger.locale.split("_")[0], res.accountMessenger.timezone);
              console.log(account);
              mainEvent.language = account.locale;
              console.log(mainEvent.locale);
              apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(account.PSID))
                .then(res => {
                  const dbUser = res.userByAccountMessenger;
                   console.log(dbUser);
                  const user = new User(dbUser.PSID, dbUser.firstName,
                    dbUser.lastName, dbUser.gender, dbUser.profilePic);
                  mainEvent.handling(user);
                })
                .catch(err => console.log(err));
            }
          })

      })
    })

  }


}

module.exports = Init;
