module.exports = {
  createUser: () => {
    return `mutation createUser($accountmessengers_id: ID!, $PSID: ID! $firstName: String, $lastName: String, $gender: String, $profilePic: String){
        createUser(accountmessengers_id: $accountmessengers_id, PSID: $PSID, firstName: $firstName, lastName: $lastName, gender: $gender, profilePic: $profilePic) {
           id
          firstName,
          lastName,
          gender,
          PSID,
          cityTraveling,
          accountmessengers_id,
          profilePic,
          isItFirstTimeCity,
          departureDateToCity,
          arrivalDateToCity,
          isTalkingToHuman,
          lastMessageToHuman,
          geoLocation {
            lat,
            lng,
            lastUpdated
          }
        }
      }
    `
  },
  updateUserByAccountMessenger: () => {
      return `mutation updateUserByAccountMessenger($PSID: ID!, $firstName: String, $lastName: String, $gender: String, $profilePic: String, $travelType: String, $geoLocation: LocationInput, $lastMessageToHuman: String){
        updateUserByAccountMessenger(PSID: $PSID, firstName: $firstName, lastName: $lastName, gender: $gender, profilePic: $profilePic, travelType: $travelType, geoLocation:$geoLocation, lastMessageToHuman: $lastMessageToHuman) {
           id
          firstName,
          lastName,
          gender,
          profilePic,
          accountmessengers_id,
          PSID,
          cityTraveling,
          isItFirstTimeCity,
          departureDateToCity,
          arrivalDateToCity,
          travelType,
          isTalkingToHuman,
          lastMessageToHuman,
          geoLocation {
            lat,
            lng,
            lastUpdated
          }
        }
      }
    `
  },
  updateLocationByAccountMessenger: () => {
      return `mutation updateLocationByAccountMessenger($PSID: ID!, $firstName: String, $lastName: String, $gender: String, $profilePic: String, $travelType: String, $geoLocation: LocationInput){
        updateLocationByAccountMessenger(PSID: $PSID, firstName: $firstName, lastName: $lastName, gender: $gender, profilePic: $profilePic, travelType: $travelType, geoLocation:$geoLocation) {
           id
          firstName,
          lastName,
          gender,
          profilePic,
          accountmessengers_id,
          PSID,
          cityTraveling,
          isItFirstTimeCity,
          departureDateToCity,
          arrivalDateToCity,
          travelType,
          isTalkingToHuman,
          lastMessageToHuman,
          geoLocation {
            lat,
            lng,
            lastUpdated
          }
        }
      }
    `
  },
  addCategoryByAccountMessenger: () => {
      return `mutation addCategoryByAccountMessenger($PSID: ID!, $category: String) {
        addCategoryByAccountMessenger(PSID: $PSID, category: $category) {
           id
          firstName,
          lastName,
          gender,
          profilePic,
          PSID,
          travelType,
          cityTraveling,
          isItFirstTimeCity,
          isTalkingToHuman,
          lastMessageToHuman,
          arrivalDateToCity,
          departureDateToCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
  updateIsTalkingWithHuman: () => {
      return `mutation updateIsTalkingWithHuman($PSID: ID!, $isTalkingToHuman: Boolean) {
        updateIsTalkingWithHuman(PSID: $PSID, isTalkingToHuman: $isTalkingToHuman) {
           id
          firstName,
          lastName,
          gender,
          profilePic,
          cityTraveling,
          isTalkingToHuman,
          lastMessageToHuman,
          arrivalDateToCity,
          departureDateToCity,
          PSID,
          travelType,
          isItFirstTimeCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
  updateCityTraveling: () => {
      return `mutation updateCityTraveling($PSID: ID!, $cityTraveling: String) {
        updateCityTraveling(PSID: $PSID, cityTraveling: $cityTraveling) {
           id
          firstName,
          lastName,
          cityTraveling,
          gender,
          profilePic,
          isTalkingToHuman,
          lastMessageToHuman,
          PSID,
          travelType,
          arrivalDateToCity,
          departureDateToCity,
          isItFirstTimeCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
  updateFirstTimeCity: () => {
      return `mutation updateFirstTimeCity($PSID: ID!, $isItFirstTimeCity: Boolean) {
        updateFirstTimeCity(PSID: $PSID, isItFirstTimeCity: $isItFirstTimeCity) {
           id
          firstName,
          lastName,
          cityTraveling,
          gender,
          profilePic,
          isTalkingToHuman,
          lastMessageToHuman,
          PSID,
          arrivalDateToCity,
          departureDateToCity,
          travelType,
          isItFirstTimeCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
  updateArrivalDate: () => {
      return `mutation updateArrivalDate($PSID: ID!, $arrivalDateToCity: String) {
        updateArrivalDate(PSID: $PSID, arrivalDateToCity: $arrivalDateToCity) {
           id
          firstName,
          lastName,
          cityTraveling,
          gender,
          profilePic,
          isTalkingToHuman,
          lastMessageToHuman,
          PSID,
          arrivalDateToCity,
          departureDateToCity,
          travelType,
          isItFirstTimeCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
  updateArrivalDateToNow: () => {
      return `mutation updateArrivalDateToNow($PSID: ID!, $arrivalDateToCity: String) {
        updateArrivalDateToNow(PSID: $PSID, arrivalDateToCity: $arrivalDateToCity) {
           id
          firstName,
          lastName,
          cityTraveling,
          gender,
          profilePic,
          isTalkingToHuman,
          lastMessageToHuman,
          PSID,
          arrivalDateToCity,
          departureDateToCity,
          travelType,
          isItFirstTimeCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
  updateDepartureDate: () => {
      return `mutation updateDepartureDate($PSID: ID!, $departureDateToCity: String) {
        updateDepartureDate(PSID: $PSID, departureDateToCity: $departureDateToCity) {
           id
          firstName,
          lastName,
          cityTraveling,
          gender,
          profilePic,
          isTalkingToHuman,
          lastMessageToHuman,
          PSID,
          arrivalDateToCity,
          departureDateToCity,
          travelType,
          isItFirstTimeCity,
          geoLocation {
            lat,
            lng,
            lastUpdated
          },
          categories {
          name,
          weight
        }
      }
     }
    `
  },
};
