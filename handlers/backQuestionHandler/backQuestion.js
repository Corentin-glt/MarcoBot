const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/Api/apiMessenger");
const userQuery = require("../../graphql/user/query");
const helper = require("../../helpers/helper");
const ApiGraphql = require("../../helpers/Api/apiGraphql");
const config = require("../../config");

module.exports = (event, senderID, locale) => {
  const product_data = new MessageData(locale);
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  let dataType = '';
  switch (event) {
    case 'RESTAURANT':
      dataType = 'selectionRestaurantType';
      break;
    case 'BAR':
      dataType = 'selectionBarType';
      break;
    case 'VISIT':
      dataType = 'selectionSiteType';
      break;
    default:
      dataType = '';
      break;
  }
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  return apiGraphql.sendQuery(userQuery.queryUserByAccountMessenger(senderID))
    .then(res => {
      if(res.userByAccountMessenger && res.userByAccountMessenger.cityTraveling) {
        event === "VISIT" ?
          messageData.message = product_data[dataType](res.userByAccountMessenger.cityTraveling)
          : messageData.message = product_data[dataType];
        return apiMessenger.sendToFacebook(messageData)
      }
    })
    .then(response => {
      console.log(response);
    })
    .catch(err => console.log(err))

};