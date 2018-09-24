const confirm = require('./confirm');
const cancel = require('./cancel');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'CONFIRM':
      confirm(senderID, locale);
      break;
    case 'CANCEL':
      cancel(senderID, locale);
  }
};