const mutationUser = require('../graphql/user/mutation');
const ApiGraphql = require('../helpers/Api/apiGraphql');
const config = require('../config');

class User {
  constructor(PSID, firstName, lastName, gender, profilePic) {
    this.PSID = PSID;
    this.firstName = firstName;
    this.lastName = lastName;
    this.gender = gender;
    this.profilePic = profilePic;
  }

  createUser(account) {
    return new Promise((resolve, reject) => {
      const userToSave = {
        firstName: this.firstName,
        lastName: this.lastName,
        gender: this.gender,
        profilePic: this.profilePic,
        PSID: this.PSID
      };
      const mutationCreateUser = mutationUser.createUser();
      const apiGraphql = new ApiGraphql(
        config.category[config.indexCategory].apiGraphQlUrl,
        config.accessTokenMarcoApi);
      userToSave.accountmessengers_id = account._id;
      apiGraphql.sendMutation(mutationCreateUser, userToSave)
        .then(userSaved => {
          resolve(userSaved);
        })
        .catch(err => reject(err))
    })
  }
}

module.exports = User;