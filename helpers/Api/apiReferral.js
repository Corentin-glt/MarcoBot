/**
 * Created by corentin on 07/11/2018.
 */
const config = require('../../config');
const axios = require('axios');
const qs = require('qs');
const request = require('request');
const Sentry = require('@sentry/node');

module.exports = {
  headParams: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  },
  sendReferral(name, senderID) {
    axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
      event: 'CUSTOM_APP_EVENTS',
      custom_events: JSON.stringify([
        {
          _eventName: name,
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
      .catch(err => Sentry.captureException(err))
  }
};