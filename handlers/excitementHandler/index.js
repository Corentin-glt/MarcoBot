const confirm = require('./confirm');
const cancel = require('./cancel');
const axios = require('axios');
const config = require('../../config');

module.exports = (payload, senderID, locale) => {
  switch (payload) {
    case 'CONFIRM':
      axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
        event: 'CUSTOM_APP_EVENTS',
        custom_events: JSON.stringify([
          {
            _eventName: 'confirm',
          }
        ]),
        advertiser_tracking_enabled: 1,
        application_tracking_enabled: 1,
        extinfo: JSON.stringify(['mb1']),
        page_id: config.category[config.indexCategory].pageId,
        page_scoped_user_id: senderID
      })
        .then(response => {
          console.log("SUCCESS event start");
        })
        .catch(err => {
          console.log(err.response.data.error);
        });
      confirm(senderID, locale);
      break;
    case 'CANCEL':
      axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
        event: 'CUSTOM_APP_EVENTS',
        custom_events: JSON.stringify([
          {
            _eventName: 'cancel',
          }
        ]),
        advertiser_tracking_enabled: 1,
        application_tracking_enabled: 1,
        extinfo: JSON.stringify(['mb1']),
        page_id: config.category[config.indexCategory].pageId,
        page_scoped_user_id: senderID
      })
        .then(response => {
          console.log("SUCCESS event start");
        })
        .catch(err => {
          console.log(err.response.data.error);
        });
      cancel(senderID, locale);
  }
};