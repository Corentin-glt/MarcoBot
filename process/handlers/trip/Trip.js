const tripValues = require("../../../assets/values/trip");
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const ViewTrip = require("../../../view/trip/ViewTrip");
const Message = require("../../../view/messenger/Message");
const userMutation = require('../../../helpers/graphql/user/mutation');
const queryProgram = require("../../../helpers/graphql/program/query");
const tripMutation = require('../../../helpers/graphql/trip/mutation');
const config = require('../../../config');
const Sentry = require("@sentry/node");
const numberDayProgramByCity = require(
  '../../../assets/variableApp/limitCityProgram');
const ViewDefault = require('../../../view/default/ViewDefault');


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
    console.log('start trip');
    const city = this.context.values.find(value => value.name === 'city');
    if (city) {
      if (typeof city.value !== 'undefined' && city.value !== null) {
        this.apiGraphql.sendMutation(userMutation.updateCityTraveling(), {
          PSID: this.event.senderId,
          cityTraveling: city.value.toLowerCase()
        })
          .then(user => {
            console.log(user);
          })
          .catch(err => Sentry.captureException(err));
      } else {
        const defaultMessage = new ViewDefault(this.user, this.event.locale);
        const messageArray = [ViewChatAction.markSeen(),
          ViewChatAction.typingOn(),
          ViewChatAction.typingOff(), defaultMessage.noCityDefault(),
          ViewChatAction.typingOn(),
          ViewChatAction.typingOff(), defaultMessage.tripCityDefault2()];
        new Message(this.event.senderId, messageArray).sendMessage();
      }
    }
    if (tripValues.length > this.context.values.length) {
      const value = this.findElemMissing();
      this[`${value}IsMissing`]();
    } else {
      const tempDeparture = this.context.values.find(
        value => value.name === 'departure');
      const arrivalDate = this.context.values.find(
        value => value.name === 'arrival');
      const departureDate = isNaN(parseInt(tempDeparture.value)) ?
        tempDeparture.value : new Date(
          new Date(arrivalDate.value).getTime() +
          parseInt(tempDeparture.value));
      const isItFirstTime = this.context.values.find(
        value => value.name === 'firstTime');
      const cityTraveling = this.context.values.find(
        value => value.name === 'city');
      const objToSend = {
        PSID: this.event.senderId,
        cityTraveling: cityTraveling.value,
        departureDateToCity: departureDate.toISOString(),
        arrivalDateToCity: arrivalDate.value,
        isItFirstTimeCity: JSON.parse(isItFirstTime.value)
      };
      this.apiGraphql.sendMutation(tripMutation.createTripByAccountMessenger(),
        objToSend)
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
      ViewChatAction.typingOff(), tripMessages.forgotCity(),
      tripMessages.chooseCity(),
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
      ViewChatAction.typingOff(),
      tripMessages.whenAreYouArriving(firstTime.value, city.value)
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
    const city = cityTraveling.value.toLowerCase();
    const arrivalDate = new Date(arrivaleDateFound.value);
    const departureDate = isNaN(parseInt(departureDateFound.value)) ?
      departureDateFound.value : new Date(
        arrivalDate.getTime() +
        parseInt(departureDateFound.value));
    console.log(departureDate);
    const duration = departureDate - arrivalDate;
    console.log(duration);
    let numberDay = duration / (24 * 60 * 60 * 1000) < 1 ? 1 :
      duration / (24 * 60 * 60 * 1000);
    numberDay > numberDayProgramByCity[city] ?
      numberDay = numberDayProgramByCity[city] : null;
    console.log(cityTraveling.value.toLowerCase());
    console.log(numberDay);
    console.log(arrivalDate);
    this.apiGraphql.sendQuery(
      queryProgram.getOneProgram(cityTraveling.value.toLowerCase(), numberDay))
      .then(program => {
        if (program.getOneProgram !== null) {
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
        } else {
          const messageArray = [
            ViewChatAction.markSeen(), ViewChatAction.typingOn(),
            ViewChatAction.typingOff(), tripMessages.couldNotFindProgram(),
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