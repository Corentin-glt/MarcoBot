const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const config = require("../../../config");
const contextMutation = require('../../../helpers/graphql/context/mutation');
const contextQuery = require("../../../helpers/graphql/context/query");
const backValues = require("../../../assets/values/back");
const ErrorMessage = require('../error/error');
const Sentry = require("@sentry/node");
const async = require('async');
const ProcessEat = require("../eat/Eat");
const ProcessDrink = require("../drink/Drink");
const ProcessVisit = require("../visit/Visit");
const Error = require('../error/error');

const contextMap = {
  eat: ProcessEat,
  drink: ProcessDrink,
  visit: ProcessVisit,
};

class Back {

  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.error = new Error(this.event);
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    if (backValues.length !== this.context.values.length) {
      this.defaultAnswer();
    } else {
      this.findContext()
        .then(context => this.updateContext(context))
        .catch(err => {
          this.error.start()
          Sentry.captureException(err)
        })
    }
  }

  defaultAnswer() {

  }

  findContext() {
    const event = this.context.values.find(value => {
      return value.name === 'event';
    }).value;
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
              if (contextArray[0].name === event) {
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

  updateContext(context) {
    const newValues = [...context.values];
    const option = this.context.values.find(value => {
      return value.name === 'option';
    }).value;
    const findIndexToDel = newValues.findIndex(item => {
      return item.name === option;
    });
    if(findIndexToDel > -1){
      newValues.splice(findIndexToDel, 1);
    }
    const filter = {
      contextId: context.id,
      page: 0,
      values: newValues
    };
    this.apiGraphql
      .sendMutation(contextMutation.updateContextByPage(), filter)
      .then(res => {
        const newContext = res.updateContextByPage;
        const processObject = new contextMap[newContext.name](
          this.event,
          newContext,
          this.user
        );
        processObject.start();
      })
      .catch(err => {
        this.error.start()
        Sentry.captureException(err);
      });
  }
}
module.exports = Back;