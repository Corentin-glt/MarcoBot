module.exports = {
  updateTripByProgramId: () => {
    return `mutation updateTripByProgramId($PSID: ID!, $cityTraveling: String ){
        updateTripByProgramId(PSID: $PSID, cityTraveling: $cityTraveling) {
          id
          users_id
          cityTraveling
          arrivalDateToCity
          departureDateToCity
          isItFirstTimeCity
          started
          createAt
        }
      }
    `
  },
  createTripByAccountMessenger: () => {
    return `mutation createTripByAccountMessenger($PSID: ID!, $cityTraveling: String, $departureDateToCity: String, $arrivalDateToCity: String, $isItFirstTimeCity: Boolean){
        createTripByAccountMessenger(PSID: $PSID, cityTraveling: $cityTraveling, departureDateToCity: $departureDateToCity, arrivalDateToCity: $arrivalDateToCity, isItFirstTimeCity: $isItFirstTimeCity) {
          id
          users_id
          cityTraveling
          arrivalDateToCity
          departureDateToCity
          isItFirstTimeCity
          started
          createAt
        }
      }
    `
  }
};
