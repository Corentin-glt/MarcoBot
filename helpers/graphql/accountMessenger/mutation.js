/**
 * Created by corentin on 02/05/2018.
 */
module.exports = {
  //PSID, locale, timezone
  createAccountMessenger: () => {
    return `mutation createAccountMessenger($PSID: ID!, $locale: String, $timezone: Float){
        createAccountMessenger(PSID: $PSID, locale: $locale, timezone: $timezone) {
          PSID,
          id
        }
      }
    `
  },
  updateSubAccountMessenger: () => {
    return `mutation updateSubscription($PSID: ID!, $subscribe: Boolean){
        updateSubscription(PSID: $PSID, subscribe: $subscribe) {
          PSID,
          id
          subscribe
        }
      }
    `
  }
};

