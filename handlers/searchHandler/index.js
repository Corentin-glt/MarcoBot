const searchRestaurant = require('./searchRestaurant');
const searchDistrict = require('./searchDistrict/searchDistrict');
const searchDistrictAt = require('./searchDistrict/searchDistrictAt');
const searchBar = require('./searchBar');
const searchTalkingWithHuman = require('./talkWithHuman');
const searchVisit = require('./searchVisit');
const searchGeolocation = require('./searchGeolocation');
const searchTicketing = require('./searchTicketing');
const axios = require('axios');
const config = require('../../config');

module.exports = (payload, senderID, locale) => {
  if(payload.includes('DISTRICTAT')){
    return searchDistrictAt(senderID, payload.slice(10), locale)
  }
  switch (payload) {
    case 'VISIT':
      searchVisit(senderID, locale);
      break;
    case 'RESTAURANT':
      searchRestaurant(senderID, locale);
      break;
    case 'BAR':
      searchBar(senderID, locale);
      break;
    case 'HUMAN':
      axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
        event: 'CUSTOM_APP_EVENTS',
        custom_events: JSON.stringify([
          {
            _eventName: 'chat_human',
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
      searchTalkingWithHuman(senderID, locale);
      break;
    case 'DISTRICT':
      searchDistrict(senderID, locale);
      break;
    case 'GEOLOCATION':
      searchGeolocation(senderID, locale);
      break;
    case 'OTHERDISTRICT':
      searchDistrictAt(senderID, 1, locale);
      break;
    case 'TICKETING':
      searchTicketing(senderID, locale);
      break;
    default:
      break;
  }
};
