const mutationAccountMessenger = require('../../helpers/graphql/accountMessenger/mutation');
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const config = require('../../config');


class Account {
  constructor(PSID, locale, timezone) {
    this.PSID = PSID;
    this.locale = locale;
    this.timezone = timezone;
  }

  createAccount() {
    return new Promise((resolve, reject) => {
      const mutationCreateAccount = mutationAccountMessenger.createAccountMessenger();
      const apiGraphql = new ApiGraphql(
        config.category[config.indexCategory].apiGraphQlUrl,
        config.accessTokenMarcoApi);
      const accountToSave = {
        PSID: this.PSID,
        locale: this.locale,
        timezone: this.timezone
      };
      apiGraphql.sendMutation(mutationCreateAccount, accountToSave)
        .then(res => {
          if (res.createAccountMessenger) {
            resolve(res.createAccountMessenger);
          }
        })
        .catch(err => reject(err));
    })
  }

}

module.exports = Account;