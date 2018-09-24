const MessageData = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
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
  messageData.message = product_data[dataType];
  apiMessenger.sendToFacebook(messageData)
    .then(response => {
      console.log(response);
    })
    .catch(err => {
      console.log(err);
    });
};