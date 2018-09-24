/**
 * Created by corentin on 20/08/2018.
 */
module.exports = {
  trip: `
    id
    users_id
    cityTraveling
    arrivalDateToCity
    departureDateToCity
    isItFirstTimeCity
  `,
  getTrips: () => {
    return `{
      getTrips{
        id
        users_id
        cityTraveling
        arrivalDateToCity
        departureDateToCity
        isItFirstTimeCity
      }    
    }`
  },
  getTripsStartTomorrow: () => {
    return `{
      getTripsStartTomorrow{
        id
        users_id
        cityTraveling
        arrivalDateToCity
        departureDateToCity
        isItFirstTimeCity
      }
    }`
  },
  getTripsByUsersId: (users_id) => {
    return `{
      getTripsByUsersId(users_id: "${users_id}"){
        id
        users_id
        cityTraveling
        arrivalDateToCity
        departureDateToCity
        isItFirstTimeCity
      }
    }`
  }
};