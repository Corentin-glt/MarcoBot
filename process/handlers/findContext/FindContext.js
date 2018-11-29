/**
 * Created by corentin on 28/11/2018.
 */
const async = require('async');
const contextQuery = require("../../../helpers/graphql/context/query");
const config = require("../../../config");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");

class FindContext {
  constructor(event, contextsToFind) {
    this.event = event;
    this.contextsToFind = contextsToFind;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    let page = 0;
    let contextFound = false;
    return new Promise((resolve, reject) => {
      async.whilst(
        () => contextFound === false,
        (callback) => {
          this.apiGraphql
            .sendQuery(
              contextQuery.getUserContextByPage(this.event.senderId, page))
            .then(res => {
              page++;
              const contextArray = res.contextsByUserAndPage;
              const contextNext = this.contextsToFind.find(item => {
                return item === contextArray[0].name;
              });
              console.log('item ==>', contextArray[0].name )
              if (typeof contextNext !== 'undefined') {
                contextFound = true;
                callback(null, contextArray[0]);
              } else {
                callback(null, contextArray[0]);
              }
            })
            .catch(err => callback(err))
        },
        (err, context) => {
          if (err) return reject(err);
          if (contextFound) {
            return resolve(context)
          }
        }
      )
    })
  }
}

module.exports = FindContext;