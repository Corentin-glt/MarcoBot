const confirm = require('./confirm');
const cancel = require('./cancel');
const axios = require('axios');
const config = require('../../config');
const ApiReferral = require('../../helpers/Api/apiReferral');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'CONFIRM':
      ApiReferral.sendReferral("confirm", senderID);
      confirm(senderID, locale);
      break;
    case 'CANCEL':
      ApiReferral.sendReferral("cancel", senderID);
      cancel(senderID, locale);
  }
};