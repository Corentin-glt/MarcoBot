module.exports = {
  updateTripByProgramId: () => {
    return `mutation updateTripByProgramId($PSID: ID!, $programId: ID! ){
        updateTripByProgramId(PSID: $PSID, programId: $programId) {
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
