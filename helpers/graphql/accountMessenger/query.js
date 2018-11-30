/**
 * Created by corentin on 02/05/2018.
 */
module.exports = {
  queryPSID: (PSID) => {
    return `{
      accountMessenger(PSID: ${PSID}) {
          id,
          PSID,
          timezone,
          createAt,
          deleted,
          subscribe,
          locale
        }
    }`
  }
};