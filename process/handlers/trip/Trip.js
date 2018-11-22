const tripValues = require("../../../assets/values/trip");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const ViewTrip = require("../../../view/trip/ViewTrip");
const Message = require("../../../view/messenger/Message");
const queryProgram = require("../../../helpers/graphql/program/query");
const tripMutation = require('../../../helpers/graphql/trip/mutation');
const config = require('../../../config');
const Sentry = require("@sentry/node");
const numberDayProgramByCity = require(
  '../../../assets/variableApp/limitCityProgram');


class Trip {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    if (tripValues.length > this.context.values.length) {
      const value = this.findElemMissing();
      this[`${value}IsMissing`]();
    } else {
      //TODO create trip
      const departureDate = this.context.values.find(value => value.name === 'departure');
      const arrivalDate = this.context.values.find(value => value.name === 'arrival');
      const isItFirstTime = this.context.values.find(value => value.name === 'firstTime');
      const cityTraveling = this.context.values.find(value => value.name === 'city');
      const objToSend = {
        PSID: this.event.senderId,
        cityTraveling: cityTraveling.value,
        departureDateToCity: departureDate.value,
        arrivalDateToCity: arrivalDate.value,
        isItFirstTimeCity: JSON.parse(isItFirstTime.value)
      };
      this.apiGraphql.sendMutation(tripMutation.createTripByAccountMessenger(), objToSend)
        .then(res => {
          this.endTrip();
        })
        .catch(err => Sentry.captureException(err));

    }
  }


  findElemMissing() {
    let valueMissing = "";
    for (let i = 0; i < tripValues.length; i++) {
      const elemFound = this.context.values.find(value => {
        return value.name === tripValues[i].name;
      });
      if (typeof elemFound === "undefined") {
        valueMissing = tripValues[i].name;
        break;
      }
    }
    return valueMissing;
  }

  cityIsMissing() {
    const tripMessages = new ViewTrip(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(), ViewChatAction.typingOn(),
      ViewChatAction.typingOff(), tripMessages.forgotCity(), tripMessages.chooseCity(),
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }

  firstTimeIsMissing() {
    const city = this.context.values.find(
      value => value.name === 'city');
    const tripMessages = new ViewTrip(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(), ViewChatAction.typingOn(),
      ViewChatAction.typingOff(), tripMessages.firstTime(city.value)
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }

  arrivalIsMissing() {
    const firstTime = this.context.values.find(
      value => value.name === 'firstTime');
    const city = this.context.values.find(
      value => value.name === 'city');
    const tripMessages = new ViewTrip(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(), ViewChatAction.typingOn(),
      ViewChatAction.typingOff(), tripMessages.whenAreYouArriving(firstTime.value, city.value)
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }

  departureIsMissing() {
    const city = this.context.values.find(
      value => value.name === 'city');
    const tripMessages = new ViewTrip(this.user, this.event.locale);
    const messageArray = [
      ViewChatAction.markSeen(), ViewChatAction.typingOn(),
      ViewChatAction.typingOff(), tripMessages.howManyDayAreStaying(city.value)
    ];
    const newMessage = new Message(this.event.senderId, messageArray);
    newMessage.sendMessage();
  }



  endTrip() {
    const tripMessages = new ViewTrip(this.user, this.event.locale);
    const arrivaleDateFound = this.context.values.find(
      value => value.name === 'arrival');
    const departureDateFound = this.context.values.find(
      value => value.name === 'departure');
    const cityTraveling = this.context.values.find(
      value => value.name === 'city');
    const city = cityTraveling.value;
    const arrivalDate = new Date(arrivaleDateFound.value);
    const departureDate = new Date(departureDateFound.value);
    const duration = departureDate - arrivalDate;
    let numberDay = duration / (24 * 60 * 60 * 1000) < 1 ? 1 : duration / (24 * 60 * 60 * 1000);
    numberDay > numberDayProgramByCity[city] ? numberDay = numberDayProgramByCity[city] : null;
    console.log(cityTraveling.value.toLowerCase());
    console.log(numberDay);
    this.apiGraphql.sendQuery(
      queryProgram.getOneProgram(cityTraveling.value.toLowerCase(), numberDay))
      .then(program => {
        console.log(program);
        const idProgram = program.getOneProgram.id;
        if (arrivalDate > new Date()) {
          const messageArray = [
            ViewChatAction.markSeen(), ViewChatAction.typingOn(),
            ViewChatAction.typingOff(), tripMessages.arrivalLater(),
          ];
          const newMessage = new Message(this.event.senderId, messageArray);
          newMessage.sendMessage();
        } else {
          const messageArray = [
            ViewChatAction.markSeen(), ViewChatAction.typingOn(),
            ViewChatAction.typingOff(), tripMessages.isHereNow(),
            ViewChatAction.typingOn(),
            ViewChatAction.smallPause(), ViewChatAction.typingOff(),
            tripMessages.itinerary(city, 1, idProgram)
          ];
          const newMessage = new Message(this.event.senderId, messageArray);
          newMessage.sendMessage();
        }
      })
      .catch(err => {
        Sentry.captureException(err);
      });

  }
}

module.exports = Trip;