const eatValues = require('../../../assets/values/eat');
const apiMessenger = require("../../../helpers/Api/apiMessenger");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");

class Eat {
  constructor(event, context, user){
    this.event = event;
    this.context = context;
    this.user = user;
  }

  start() {
    if(eatValues.length > this.context.values.length){
      const value = this.findElemMissing();
      this[`${value}IsMissing`]()
    } else {
      this.sendRestaurants();
    }
  }

  findElemMissing(){
    let valueMissing = '';
    eatValues.map(item => {
      const elemFound = this.context.values.find(value => {
        return value.name === item.name;
      })
      if(typeof elemFound === "undefined"){
        valueMissing = item.name;
      }
    })
    return valueMissing;
  }

  sendRestaurants(){
    console.log('FINAL STEP RESTAURANTS ')
  }

  categoryIsMissing() {
    console.log('MISSING CATEGORY ')
  }

  priceIsMissing() {
    console.log('MISSING PRICE ')
  }

}

module.exports = Eat;
