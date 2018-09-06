const searchRestaurant = require('./searchRestaurant');
const searchDistrict = require('./searchDistrict/searchDistrict');
const searchDistrictAt = require('./searchDistrict/searchDistrictAt');
const searchBar = require('./searchBar');
const searchTalkingWithHuman = require('./talkWithHuman');
const searchVisit = require('./searchVisit');

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
      searchTalkingWithHuman(senderID, locale);
      break;
    case 'DISTRICT':
      searchDistrict(senderID, locale);
      break;
    case 'OTHERDISTRICT':
      searchDistrictAt(senderID, 1, locale);
      break;
    default:
      break;
  }
};
