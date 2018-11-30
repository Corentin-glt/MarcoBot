const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const ViewChatAction = require("../../../view/chatActions/ViewChatAction");
const ViewTrip = require("../../../view/trip/ViewTrip");
const Message = require("../../../view/messenger/Message");
const queryProgram = require("../../../helpers/graphql/program/query");
const tripMutation = require('../../../helpers/graphql/trip/mutation');
const config = require('../../../config');
const queryItinerary = require('../../../helpers/graphql/itinerary/query');
const Sentry = require("@sentry/node");
const numberDayProgramByCity = require(
  '../../../assets/variableApp/limitCityProgram');
const ViewItinerary = require('../../../view/itinerary/ViewItinerary');
const Error = require('../error/error');

class Itinerary {
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
      const city = this.context.values.find(
        value => value.name === 'city');
      const objToSend = {
        PSID: this.event.senderId,
        cityTraveling: city.value
      };
      if (this.context.page === 0) {
        this.apiGraphql.sendMutation(tripMutation.updateTripByProgramId(),
          objToSend)
          .then(res => {
              this.getNextItinerary(this.context.page);
          })
          .catch(err => {
            this.error.start();
            Sentry.captureException(err)
          });
      } else {
        this.getNextItinerary(this.context.page);
    }
  }

  getNextItinerary(nextNumber) {
    const itineraryMessage = new ViewItinerary(this.user, this.event.locale);
    const program = this.context.values.find(
      value => value.name === 'program');
    const day = this.context.values.find(
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
          const program = this.context.values.find(
            value => value.name === 'program');
          const numberDay = this.context.values.find(
            value => value.name === 'day');
          this.apiGraphql.sendQuery(queryProgram.getProgramById(program.value))
            .then(res => {
              const programToSend = res.getProgramById;
              const messageArray = [
                ViewChatAction.markSeen(),
                ViewChatAction.typingOn(), ViewChatAction.typingOff(),
                itineraryMessage.textBeforeShare(
                  programToSend.url_articles[numberDay.value - 1]),
                ViewChatAction.typingOn(), ViewChatAction.typingOff(),
                itineraryMessage.shareOrFindUrlMedium()

              ];
              console.log(messageArray);
              const newMessage = new Message(this.event.senderId, messageArray);
              newMessage.sendMessage();

            })
            .catch(err => {
              this.error.start();
              Sentry.captureException(err)
            });
        }
      })
      .catch(err => {
        this.error.start();
        Sentry.captureException(err)
      });
  }


  // getFirstItinerary() {
  //   const itineraryMessage = new ViewItinerary(this.user, this.event.locale);
  //   const program = this.context.values.find(value => value.name === 'program');
  //   const day = this.context.values.find(value => value.name === 'day');
  //   this.apiGraphql.sendQuery(
  //     queryItinerary.getItineraries(program.value, day.value))
  //     .then(res => {
  //       const itineraries = res.getItineraries;
  //       const itineraryToSend = itineraries.find(
  //         itinerary => itinerary.order = 1);
  //       let locationsGoogleMap = itineraryToSend.locations.length > 1 ?
  //         'dir' : 'place';
  //       itineraryToSend.locations.forEach(location => {
  //         const nameOfLocation = location.name.split(' ').join('+');
  //         locationsGoogleMap =
  //           `${locationsGoogleMap}/${nameOfLocation}`;
  //       });
  //       const descriptionToSend = this.event.locale === 'fr' ?
  //         itineraryToSend.descriptionFr : itineraryToSend.description;
  //       const messageArray = [
  //         ViewChatAction.markSeen(),
  //         ViewChatAction.typingOn(), ViewChatAction.typingOff(),
  //         itineraryMessage.sendPhotoItinerary(itineraryToSend.photo),
  //         ViewChatAction.typingOn(), ViewChatAction.typingOff(),
  //         itineraryMessage.itineraryNotifications(descriptionToSend,
  //           locationsGoogleMap)
  //       ];
  //       console.log(messageArray);
  //       const newMessage = new Message(this.event.senderId, messageArray);
  //       newMessage.sendMessage();
  //     })
  //     .catch(err => Sentry.captureException(err));
  // }


}

module.exports = Itinerary;