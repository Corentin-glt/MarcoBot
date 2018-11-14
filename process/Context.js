const ApiGraphql = require("../helpers/Api/apiGraphql");
const config = require("../config");
const globalContext = require('../assets/context');

class Context {
  constructor(dictContext, dictValue) {
    this.dictContext = globalContext(dictContext);
  }

  createContext() {

  }

  udpateContext() {

  }

  getContext() {


  }


}

module.exports = Context;
