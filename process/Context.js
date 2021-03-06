const ApiGraphql = require("../helpers/Api/apiGraphql");
const config = require("../config");
const contextQuery = require("../helpers/graphql/context/query");
const contextMutation = require("../helpers/graphql/context/mutation");
const globalContext = require("../assets/context");
const dictValue = require("../assets/valuesContext");
const Sentry = require("@sentry/node");
const ErrorMessage = require('../process/handlers/error/error');
const Process = require("./Process");
const Error = require('./handlers/error/error');

class Context {
  constructor(event, inputContext, inputValue, dictContext) {
    this.event = event;
    this.dictContext = globalContext(dictContext);
    this.inputContext = inputContext;
    this.inputValue = inputValue;
    this.error = new Error(this.event);
    this.newContext = {};
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  mapContext() {
    const context = Object.keys(this.dictContext).find((key, idx) => {
      const elemFound = this.dictContext[key].find(elem => {
        return elem === this.inputContext;
      });
      return elemFound !== null && typeof elemFound !== "undefined";
    });
      const values = this.getContextValues(context);
      this.newContext = Object.assign(
        {},
        {
          name: context,
          page: 0,
          values: values
        }
      );
      this.handleContext();
  }

  getContextValues() {
    let valueArray = [];
    const keyArray = Object.keys(this.inputValue);
    keyArray.forEach(keyValue => {
      let tempObj = {};
      tempObj.name = keyValue;
      tempObj.value = this.inputValue[keyValue];
      valueArray.push(tempObj);
    });
    return valueArray;
  }

  checkContext(userContextArray) {
    const found = userContextArray.find(
      itm => itm.name === this.newContext.name
    );
    return (
      typeof found !== "undefined" &&
      found.values.length === dictValue[this.newContext.name].length
    );
  }

  handleContext() {
    this.apiGraphql
      .sendQuery(contextQuery.getUserContext(this.event.senderId))
      .then(res => {
        const userContextArray = res.contextsByUser;
        if (userContextArray === null || userContextArray.length === 0) {
          this.createContext();
        } else if (this.checkContext(userContextArray)) {
          this.createContext();
        } else if (!userContextArray.find(
          itm => itm.name === this.newContext.name)) {
          this.createContext();
        } else if (this.newContext.name === 'trip' && this.newContext.values.find(value => value.name === 'city')) {
          this.createContext();
        } else {
          this.udpateContext(userContextArray);
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err);
      });
  }

  createContext() {
    this.newContext.PSID = this.event.senderId;
    this.apiGraphql
      .sendMutation(contextMutation.createContext(), this.newContext)
      .then(res => {
        const process = new Process(this.event);
        process.start();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err);
      });
  }

  udpateContext(userContextArray) {
    const contextToUpdate = userContextArray.find(
      itm => itm.name === this.newContext.name
    );
    const objToUpdate = {
      contextId: contextToUpdate.id,
      values: this.newContext.values
    };
    this.apiGraphql
      .sendMutation(contextMutation.updateContext(), objToUpdate)
      .then(res => {
        const process = new Process(this.event);
        process.start();
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err);
      });
  }
}

module.exports = Context;
