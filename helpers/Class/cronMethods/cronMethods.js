/**
 * Created by corentin on 20/08/2018.
 */
const ApiGraphql = require('../../Api/apiGraphql');
const apiMessenger = require('../../Api/apiMessenger');
const config = require("../../../config");
const async = require("async");
const queryTrip = require('../../graphql/trip/query');
const queryProgram = require('../../graphql/program/query');
const queryItinerary = require('../../graphql/itinerary/query');
const queryUser = require('../../graphql/user/query');
const userMutation = require('../../graphql/user/mutation');
const queryAccountMessenger = require('../../graphql/accountMessenger/query');
const MessageData = require("../../../messenger/product_data");
const numberDayProgramByCity = require('../../../variableApp/limitCityProgram');
const axios = require("axios");
const ApiReferral = require('../../Api/apiReferral');

class CronMethods {
  constructor() {
    this.apiGraphql =
      new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl,
        config.accessTokenMarcoApi);
  }

  static sendMessage(senderId, data, typeMessage) {
    return new Promise((resolve, reject) => {
      const objectToSend = {
        recipient: {id: senderId},
        messaging_types: typeMessage,
        message: data
      };
      apiMessenger.sendToFacebook(objectToSend)
        .then((res) => resolve(res))
        .catch(err => reject(err));
    });
  };

  static diffDayBetween2Date(first, second) {
    second = new Date(new Date(second).setHours(0, 0, 0, 0));
    first = new Date(new Date(first).setHours(0, 0, 0, 0));
    return Math.round((second - first) / (1000 * 60 * 60 * 24));
  };

  sendGroupInvitation() {
    return this.apiGraphql.sendQuery(queryTrip.getPastTrips())
      .then(trips => {
        return async.each(trips.getPastTrips, (trip, callback) => {
          const days = CronMethods.diffDayBetween2Date(trip.departureDateToCity,
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
                      const product_data = new MessageData(locale);
                      return CronMethods.sendMessage(PSID,
                        product_data.groupInvitation, "RESPONSE")
                        .then(() => {
                          this.apiGraphql.sendMutation(userMutation.updateGroupInvitation(),
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
          const numberDayAlreadyDone = CronMethods.diffDayBetween2Date(
            dayArrival, new Date()) + 1;
          const numberDayIsStaying =
            CronMethods.diffDayBetween2Date(dayArrival, dayDeparture) >=
            numberDayProgramByCity[trip.cityTraveling] ?
              numberDayProgramByCity[trip.cityTraveling] :
              CronMethods.diffDayBetween2Date(dayArrival, dayDeparture) + 1;
          console.log('VILLE: ', trip.cityTraveling, '\nNOMBRE DE JOUR FAIT: ',
            numberDayAlreadyDone,
            '\nNUMBRE DE JOUR QU\'IL RESTE DANS LA VILLE : ',
            numberDayIsStaying, '\n\n');
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
                            const product_data = new MessageData(locale);
                            if (accountMessenger.accountMessenger.subscribe) {
                              return CronMethods.sendMessage(PSID,
                                product_data.messageOfItineraryNotification(
                                  user.user.firstName,
                                  trip.cityTraveling, numberDayAlreadyDone,
                                  idProgram), "RESPONSE")
                                .then(() => {
                                  ApiReferral.sendReferral("notificationItinerarySent", PSID)
                                })
                                .catch(err => {
                                  callback();
                                  console.log(err.response.data);
                                })
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
                    const product_data = new MessageData(locale);
                    if (accountMessenger.accountMessenger.subscribe) {
                      return CronMethods.sendMessage(PSID,
                        product_data.messageForTomorrow(user.user.firstName,
                          trip.cityTraveling), "RESPONSE")
                        .then(() => {
                          ApiReferral.sendReferral("notificationDayBeforeSent", PSID)
                          return callback()
                        })
                        .catch(err => {
                          callback();
                          console.log(err.response.data);
                        })
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
            console.log('cron check last Message done! ')
          })
        }
      })
      .catch(err => console.log(err))
  }
}


module.exports = CronMethods;