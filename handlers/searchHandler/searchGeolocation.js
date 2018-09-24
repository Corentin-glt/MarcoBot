const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const mutationUser = require('../../graphql/user/mutation');
const ApiGraphql = require("../../helpers/apiGraphql");
const config = require("../../config");

module.exports = (senderID, locale) => {
  const product_data = new MessageData(locale);
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  apiGraphql.sendMutation(mutationUser.updateLastEventLocation(),
    {PSID: senderID, lastEvent: 'aroundMe'})
    .then(res => {
      if (res.updateLastEventLocation) {
        messageData.message = product_data.preGeolocation;
        return apiMessenger.sendToFacebook(messageData)
      }
    })
    .then(response => {
      console.log("end geolocation");
    })
    .catch(err => {
      console.log(err);
    });
};