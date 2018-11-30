const mutationUser = require('../../helpers/graphql/user/mutation');
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const config = require('../../config');
const userQuery = require('../../helpers/graphql/user/query');
const Sentry = require('@sentry/node');


class User {
  constructor(PSID, firstName, lastName, gender, profilePic) {
    this.PSID = PSID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.profilePic = profilePic;
    this.isTalkingToHuman = '';
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi);
  }

  humanTalk() {
    return new Promise((resolve, reject) => {
      this.apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(this.PSID))
        .then(res =>  {
          if (res.userByAccountMessenger) {
            resolve(res.userByAccountMessenger);
          }
        })
        .catch(err => {
          reject(err);
          Sentry.captureException(err)
        });
    })
  }

  createUser(accountId) {
    return new Promise((resolve, reject) => {
      const userToSave = {
        firstName: this.firstName,
        lastName: this.lastName,
        gender: this.gender,
        profilePic: this.profilePic,
        PSID: this.PSID,
        accountmessengers_id: accountId
      };
      const mutationCreateUser = mutationUser.createUser();
      this.apiGraphql.sendMutation(mutationCreateUser, userToSave)
        .then(userSaved => {
          resolve(userSaved);
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = User;