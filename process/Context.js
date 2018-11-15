const ApiGraphql = require("../helpers/Api/apiGraphql");
const config = require("../config");
const contextQuery = require('../graphql/context/query');
const contextMutation = require('../graphql/context/mutation');
const globalContext = require('../assets/context');
const dictValue = require('../assets/valuesContext');
const Sentry = require('@sentry/node');


class Context {
  constructor(senderId, inputContext, inputValue, dictContext) {
    this.senderId = senderId;
    this.dictContext = globalContext(dictContext);
    this.inputContext = inputContext;
    this.inputValue = inputValue;
    this.newContext = {};
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi);
   }

  mapContext() {
    const context = Object.keys(this.dictContext).find((key, idx) => {
      const elemFound = this.dictContext[key].find(elem => {
        return elem === this.inputContext;
      });
      return elemFound !== null && typeof elemFound !== 'undefined';
    });
    const values = this.getContextValues(context);
    console.log(values);
    this.newContext = Object.assign({}, {
      name: context,
      page: 0,
      values: values
    });
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
      //
      // console.log(keyValue);
      // const valueTemp = dictValue[context];
      // const funcValue = valueTemp[keyValue];
      // valueArray.push(funcValue(keyValue, this.inputValue[keyValue]))
    });
    return valueArray;
  }

  checkContext(userContextArray) {
    const found = userContextArray.find(itm => itm.name === this.newContext.name);
    return typeof found !== 'undefined' && found.values.length === dictValue[this.newContext.name].length;
  }

  handleContext() {
    this.apiGraphql.sendQuery(contextQuery.getUserContext(this.senderId))
      .then(res => {
        const userContextArray = res.contextsByUser;
        console.log(this.checkContext(userContextArray));
        if (userContextArray === null) {
          console.log('create context');
          this.createContext();
        } else if (this.checkContext(userContextArray)) {
          console.log('create contexxt');
            this.createContext();
        } else {
          console.log('update context');
          this.udpateContext(userContextArray);
        }
      })
      .catch((err) => {
        console.log(err);
        Sentry.captureException(err)});
  }


  createContext() {
    this.newContext.PSID = this.senderId;
    this.apiGraphql.sendMutation(contextMutation.createContext(), this.newContext)
      .then(res => {
          console.log(res);
      })
      .catch(err => {
        console.log(err);
        Sentry.captureException(err)
      });
  }

  udpateContext(userContextArray) {
    const contextToUpdate = userContextArray.find(itm => itm.name === this.newContext.name);
    console.log(contextToUpdate);
    const objToUpdate = {
      contextId: contextToUpdate.id,
      values: this.newContext.values
    };
    this.apiGraphql.sendMutation(contextMutation.updateContext(), objToUpdate)
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
        Sentry.captureException(err)
      });
  }


}

module.exports = Context;
