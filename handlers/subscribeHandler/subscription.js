/**
 * Created by corentin on 23/08/2018.
 */
const product_data = require("../../messenger/product_data");
const apiMessenger = require("../../helpers/apiMessenger");
const ApiGraphql = require("../../helpers/apiGraphql");
const accountMessenger = require('../../graphql/accountMessenger/mutation');
const helper = require("../../helpers/helper");
const config = require('../../config');

module.exports = (senderID) => {
  let messageData = {
    recipient: {
      id: senderID
    },
    message: ''
  };
  messageData.message = product_data.wouldYouSubOrUnsub;
  apiMessenger.sendToFacebook(messageData)
    .then(response => {
      console.log('help');
    })
    .catch(err => {
      console.log(err.response.data.error);
    });

};