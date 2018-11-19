const ApiGraphql = require('../helpers/Api/apiGraphql');
const config = require("../config");
const contextQuery = require('../helpers/graphql/context/query');
const userQuery = require('../helpers/graphql/user/query');
const Sentry = require('@sentry/node');




class Process {
  constructor(event) {
    this.event = event;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    this.apiGraphql
      .sendQuery(userQuery.queryUserByAccountMessenger(this.event.senderId))
      .then(res => {
        if (res.userByAccountMessenger) {
          this.apiGraphql
            .sendQuery(contextQuery.getUserContext(this.event.senderId))
            .then(res => {
              console.log(res.contextsByUser);

            })
            .catch(err => {
              console.log(err);
              Sentry.captureException(err);
            })
        } else {
          console.log('user not found');
          Sentry.captureException('user not found in process');
        }
      })
      .catch(err => {
        console.log(err);
        Sentry.captureException(err);
      })
  }
}


module.exports = Process;