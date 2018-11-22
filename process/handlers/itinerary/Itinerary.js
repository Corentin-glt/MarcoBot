const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const ViewTrip = require("../../../view/trip/ViewTrip");
const Message = require("../../../view/messenger/Message");
const queryProgram = require("../../../helpers/graphql/program/query");
const config = require('../../../config');
const queryItinerary = require('../../../helpers/graphql/itinerary/query');
const Sentry = require("@sentry/node");
const numberDayProgramByCity = require(
  '../../../assets/variableApp/limitCityProgram');
const ViewItinerary = require('../../../view/itinerary/ViewItinerary');


class Itinerary {
  constructor(event, contextArray, user) {
    this.event = event;
    this.context = contextArray[0];
    this.contextArray = contextArray;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    if (this.context.name === 'itinerary') {
      this.getFirstItinerary();
    } else if (this.context.name === 'next') {
      let nextNumber = 0;
      for (let i = 0; i < this.contextArray.length; i++) {
        if (this.contextArray[i].name === 'itinerary') {
          break;
        } else if (this.contextArray[i].name === 'next') {
          nextNumber++;
        }
      }
      this.getNextItinerary(nextNumber);
    }
  }

  getNextItinerary(nextNumber) {
    console.log('NEXT ITINERARY');
    const itineraryMessage = new ViewItinerary(this.user, this.event.locale);
    const program = this.contextArray[nextNumber].values.find(
      value => value.name === 'program');
    const day = this.contextArray[nextNumber].values.find(
      value => value.name === 'day');
    this.apiGraphql.sendQuery(
      queryItinerary.getItineraries(program.value, day.value))
      .then(res => {
        const itineraries = res.getItineraries;
        const orderNumber = nextNumber + 1;
        if (orderNumber <= itineraries.length) {
          const itineraryToSend = itineraries.find(
            itinerary => itinerary.order === orderNumber);
          let locationsGoogleMap = itineraryToSend.locations.length > 1 ?
            'dir' : 'place';
          itineraryToSend.locations.forEach(location => {
            const nameOfLocation = location.name.split(' ').join('+');
            locationsGoogleMap =
              `${locationsGoogleMap}/${nameOfLocation}`;
          });
          const descriptionToSend = this.event.locale === 'fr' ?
            itineraryToSend.descriptionFr : itineraryToSend.description;
          const messageArray = [
            ViewChatAction.markSeen(),
            ViewChatAction.typingOn(), ViewChatAction.typingOff(),
            itineraryMessage.sendPhotoItinerary(itineraryToSend.photo),
            ViewChatAction.typingOn(), ViewChatAction.typingOff(),
            itineraryMessage.itineraryNotifications(descriptionToSend,
              locationsGoogleMap)
          ];
          const newMessage = new Message(this.event.senderId, messageArray);
          newMessage.sendMessage();
        } else {
          console.log('SEND LAST');
          const program = this.context.values.find(value => value.name === 'program');
          const numberDay = this.context.values.find(value => value.name === 'day');
          this.apiGraphql.sendQuery(queryProgram.getProgramById(program.value))
              .then(res => {
                console.log(res);
                const programToSend = res.getProgramById;
                const messageArray = [
                  ViewChatAction.markSeen(),
                  ViewChatAction.typingOn(), ViewChatAction.typingOff(),
                  itineraryMessage.textBeforeShare(programToSend.url_articles[numberDay.value - 1]),
                  ViewChatAction.typingOn(), ViewChatAction.typingOff(), itineraryMessage.shareOrFindUrlMedium
                ];
                console.log(messageArray);
                const newMessage = new Message(this.event.senderId, messageArray);
                newMessage.sendMessage();

              })
              .catch(err => Sentry.captureException(err));
        }
      })
      .catch(err => Sentry.captureException(err));
  }


  getFirstItinerary() {
    const itineraryMessage = new ViewItinerary(this.user, this.event.locale);
    const program = this.context.values.find(value => value.name === 'program');
    const day = this.context.values.find(value => value.name === 'day');
    this.apiGraphql.sendQuery(
      queryItinerary.getItineraries(program.value, day.value))
      .then(res => {
        const itineraries = res.getItineraries;
        const itineraryToSend = itineraries.find(
          itinerary => itinerary.order = 1);
        let locationsGoogleMap = itineraryToSend.locations.length > 1 ?
          'dir' : 'place';
        itineraryToSend.locations.forEach(location => {
          const nameOfLocation = location.name.split(' ').join('+');
          locationsGoogleMap =
            `${locationsGoogleMap}/${nameOfLocation}`;
        });
        const descriptionToSend = this.event.locale === 'fr' ? itineraryToSend.descriptionFr : itineraryToSend.description
        const messageArray = [
          ViewChatAction.markSeen(),
          ViewChatAction.typingOn(), ViewChatAction.typingOff(),
          itineraryMessage.sendPhotoItinerary(itineraryToSend.photo),
          ViewChatAction.typingOn(), ViewChatAction.typingOff(),
          itineraryMessage.itineraryNotifications(descriptionToSend, locationsGoogleMap)
        ];
        console.log(messageArray);
        const newMessage = new Message(this.event.senderId, messageArray);
        newMessage.sendMessage();
      })
      .catch(err => Sentry.captureException(err));
  }


}

module.exports = Itinerary;