/**
 * Created by corentin on 07/11/2018.
 */
const Sentry = require('@sentry/node');
const config = require('../../../../../../config');
const ApiGraphql = require('../../../../../../helpers/Api/apiGraphql');
const user = require("../../../../../../graphql/user/query");
const receiveLocationItinerary = require('./handlers/receiveLocationItinerary');
const receiveLocationAroundMe = require('./handlers/receiveLocationAroundMe');

module.exports = (event) => {
  const senderID = event.sender.id;
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const query = user.queryUserByAccountMessenger(senderID);
  apiGraphql.sendQuery(query)
    .then(response => {
      const user = response.userByAccountMessenger;
      switch (user.geoLocation.lastEvent) {
        case "itinerary":
          receiveLocationItinerary(event);
          break;
        case "aroundMe":
          receiveLocationAroundMe(event);
          break;
        default:
          Sentry.captureMessage('Something went wrong');
          break;
      }
    })
    .catch(err => Sentry.captureException(err))
};