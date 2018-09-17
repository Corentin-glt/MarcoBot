module.exports = {
  queryUser: (id) => {
    return `{
      user(id: "${id}") {
          id,
          PSID,
          firstName,
          lastName,
          createAt,
          gender,
          deleted,
          isTalkingToHuman,
          lastMessageToHuman,
          cityTraveling,
          departureDateToCity,
          isItFirstTimeCity,
          arrivalDateToCity,
          geoLocation {
            lat,
            lng,
            lastEvent,
            lastUpdated
          }
        }
    }`
  },
  queryUserByAccountMessenger: (id) => {
    return `{
      userByAccountMessenger(PSID: "${id}") {
          id,
          PSID,
          firstName,
          lastName,
          createAt,
          gender,
          deleted,
          isTalkingToHuman,
          lastMessageToHuman,
          cityTraveling,
          isItFirstTimeCity,
          departureDateToCity,
          arrivalDateToCity,
          geoLocation {
            lat,
            lng,
            lastEvent,
            lastUpdated
          }
        }
    }`
  },
  usersByLastMessageToHuman: () => {
    return `{
        usersByLastMessageToHuman{
          id,
          PSID,
          firstName,
          lastName,
          createAt,
          gender,
          deleted,
          isTalkingToHuman,
          lastMessageToHuman,
          cityTraveling,
          departureDateToCity,
          isItFirstTimeCity,
          arrivalDateToCity,
          geoLocation {
            lat,
            lng,
            lastEvent,
            lastUpdated
          }
        }
      }`
  },
};
