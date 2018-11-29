/**
 * Created by corentin on 20/08/2018.
 */
const ApiGraphql = require('../../../helpers/Api/apiGraphql');
const apiMessenger = require('../../../helpers/Api/apiMessenger');
const config = require("../../../config");
const async = require("async");
const queryTrip = require('../../../helpers/graphql/trip/query');
const queryProgram = require('../../../helpers/graphql/program/query');
const queryItinerary = require('../../../helpers/graphql/itinerary/query');
const queryUser = require('../../../helpers/graphql/user/query');
const userMutation = require('../../../helpers/graphql/user/mutation');
const queryAccountMessenger = require('../../../helpers/graphql/accountMessenger/query');
const MessageData = require("../../../messenger/product_data");
const numberDayProgramByCity = require(
  '../../../assets/variableApp/limitCityProgram');
const axios = require("axios");
const ApiReferral = require('../../../helpers/Api/apiReferral');
const ViewNotifications = require(
  '../../../view/notifications/ViewNotifications');
const Message = require('../../../view/messenger/Message');

class Notifications {
  constructor() {
    this.apiGraphql =
      new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl,
        config.accessTokenMarcoApi);
  }

  static diffDayBetween2Date(first, second) {
    second = new Date(new Date(second).setHours(0, 0, 0, 0));
    first = new Date(new Date(first).setHours(0, 0, 0, 0));
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  };

  sendGroupInvitation() {
    return this.apiGraphql.sendQuery(queryTrip.getPastTrips())
      .then(trips => {
        return async.each(trips.getPastTrips, (trip, callback) => {
          const days = Notifications.diffDayBetween2Date(trip.departureDateToCity,
            new Date());
          if (days === 1 && trip.started) {
            this.apiGraphql.sendQuery(queryUser.queryUser(trip.users_id))
              .then(user => {
                if (!user.user.groupInvitation) {
                  const PSID = user.user.PSID;
                  return this.apiGraphql.sendQuery(
                    queryAccountMessenger.queryPSID(PSID))
                    .then(accountMessenger => {
                      const locale = accountMessenger.accountMessenger.locale.split(
                        "_")[0];
                      const notificationMessage = new ViewNotifications(user,
                        locale);
                      const messageArray = [
                        notificationMessage.groupInvitation()
                      ];
                      new Message(PSID, messageArray).sendMessage();
                      this.apiGraphql.sendMutation(
                        userMutation.updateGroupInvitation(),
                        {PSID: PSID, groupInvitation: true})
                        .then(res => {
                          callback();
                        })
                        .catch(err => {
                          console.log(err);
                        })
                    })
                    .catch(err => {
                      callback(err);
                      console.log(err);
                    })
                } else {

                  callback();
                }
              })
              .catch(err => {
                callback(err);
                console.log(err);
              })
          } else {
            callback();
          }
        }, err => {
          if (err) console.log(err);
        })
      })
      .catch(err => console.log(err));
  }

  sendProgram() {
    return this.apiGraphql.sendQuery(queryTrip.getTrips())
      .then(trips => {
        async.each(trips.getTrips, (trip, callback) => {
          const dayArrival = new Date(trip.arrivalDateToCity);
          const dayDeparture = new Date(trip.departureDateToCity);
          const numberDayAlreadyDone = Notifications.diffDayBetween2Date(
            dayArrival, new Date()) + 1;
          const numberDayIsStaying =
            Notifications.diffDayBetween2Date(dayArrival, dayDeparture) >=
            numberDayProgramByCity[trip.cityTraveling] ?
              numberDayProgramByCity[trip.cityTraveling] :
              Notifications.diffDayBetween2Date(dayArrival, dayDeparture) + 1;
          if (numberDayAlreadyDone <= numberDayIsStaying) {
            return this.apiGraphql.sendQuery(
              queryProgram.getOneProgram(trip.cityTraveling,
                numberDayIsStaying))
              .then(program => {
                if (program.getOneProgram) {
                  const idProgram = program.getOneProgram.id;
                  return this.apiGraphql.sendQuery(
                    queryUser.queryUser(trip.users_id))
                    .then(user => {
                      if (user.user) {
                        const PSID = user.user.PSID;
                        return this.apiGraphql.sendQuery(
                          queryAccountMessenger.queryPSID(PSID))
                          .then(accountMessenger => {
                            const locale = accountMessenger.accountMessenger.locale.split(
                              "_")[0];
                            if (accountMessenger.accountMessenger.subscribe) {
                              const notificationMessage = new ViewNotifications(
                                locale, user.user);
                              const messageArray = [
                                notificationMessage.itineraryNotification(
                                  trip.cityTraveling, numberDayAlreadyDone,
                                  idProgram)
                              ];
                              new Message(PSID, messageArray).sendMessage();
                              ApiReferral.sendReferral(
                                "notificationItinerarySent", PSID)
                            } else {
                              callback()
                            }
                          })
                          .catch(err => callback())
                      } else {
                        callback()
                      }
                    })
                    .catch(err => callback())
                } else {
                  callback();
                }
              })
          } else {
            callback()
          }
        })
      })
      .catch(err => console.log(err))
  }

  readyForTomorrow() {
    return this.apiGraphql.sendQuery(queryTrip.getTripsStartTomorrow())
      .then((trips) => {
        async.each(trips.getTripsStartTomorrow, (trip, callback) => {
          return this.apiGraphql.sendQuery(queryUser.queryUser(trip.users_id))
            .then(user => {
              if (user.user) {
                const PSID = user.user.PSID;
                return this.apiGraphql.sendQuery(
                  queryAccountMessenger.queryPSID(PSID))
                  .then(accountMessenger => {
                    const locale = accountMessenger.accountMessenger.locale.split(
                      "_")[0];
                    if (accountMessenger.accountMessenger.subscribe) {
                      const notificationMessage = new ViewNotifications(user,
                        locale);
                      const messageArray = [
                        notificationMessage.messageForTomorrow(user.user.firstName,
                          trip.cityTraveling)
                      ];
                      new Message(PSID, messageArray).sendMessage();
                      ApiReferral.sendReferral("notificationDayBeforeSent",
                        PSID);
                    } else {
                      callback();
                    }
                  })
                  .catch(err => callback())
              } else {
                callback()
              }
            })
            .catch(err => callback())
        })
      })
      .catch(err => console.log(err))
  }

  checkLastMessageToHuman() {
    return this.apiGraphql.sendQuery(queryUser.usersByLastMessageToHuman())
      .then(res => {
        if (res.usersByLastMessageToHuman) {
          async.each(res.usersByLastMessageToHuman, (user, callback) => {
            return this.apiGraphql.sendMutation(
              userMutation.updateIsTalkingWithHuman(),
              {PSID: user.PSID, isTalkingToHuman: false})
              .then((response) => {
                callback()
              })
              .catch(err => callback(err))
          }, (err) => {
            if (err) console.log(err);
          })
        }
      })
      .catch(err => console.log(err))
  }
}


module.exports = Notifications;