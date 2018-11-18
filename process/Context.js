const ApiGraphql = require("../helpers/Api/apiGraphql");
const config = require("../config");
const contextQuery = require('../helpers/graphql/context/query');
const contextMutation = require('../helpers/graphql/context/mutation');
const globalContext = require('../assets/context');
const dictValue = require('../assets/valuesContext');
const Sentry = require('@sentry/node');
// const Template = require('../view/messenger/Template');
const Message = require('../view/messenger/Message');
const Text = require('../view/messenger/Text');
const ChatAction = require('../view/messenger/ChatAction');


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
    console.log(context);
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
        if (userContextArray === null || userContextArray.length === 0) {
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
        let messageArray = [];
        const action = new ChatAction('mark_seen');
      action.get();
      messageArray.push(action.template);
        const quickRep = new Text('What\'s your favorite House in Game Of Thrones');
        quickRep
          .addQuickReply('Stark', 'STARK')
          .addQuickReply('Lannister', 'LANNISTER')
          .addQuickReply('Targaryen', 'TARGARYEN')
          .addQuickReply('None of the above', 'OTHER')
          .get();
        messageArray.push(quickRep.template);
        const newMessage = new Message(this.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => {
        console.log(err);
        Sentry.captureException(err)
      });
  }


}

module.exports = Context;
