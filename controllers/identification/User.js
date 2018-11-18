const mutationUser = require('../../helpers/graphql/user/mutation');
const ApiGraphql = require('../../helpers/Api/apiGraphql');
const config = require('../../config');

class User {
  constructor(PSID, firstName, lastName, gender, profilePic) {
    this.PSID = PSID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.profilePic = profilePic;
    this.isTalkingToHuman = '';
  }

  set humanTalk(talk) {
    this.isTalkingToHuman = talk;
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
      const apiGraphql = new ApiGraphql(
        config.category[config.indexCategory].apiGraphQlUrl,
        config.accessTokenMarcoApi);
      apiGraphql.sendMutation(mutationCreateUser, userToSave)
        .then(userSaved => {
          console.log(userSaved);
          resolve(userSaved);
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = User;