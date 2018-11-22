/**
 * Created by corentin on 29/08/2018.
 */
const district2 = (trans) => {
  return [
    {
      "title": trans.__("district2Westminster"),
      "image_url": "https://api.marco-app.com/api/image/minWestminster.jpg",
      "subtitle": trans.__("district2WestminsterSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_westminster"
        }
      ]
    },
    {
      "title": trans.__("district2Covent"),
      "image_url": "https://api.marco-app.com/api/image/minCoventGarden.jpg",
      "subtitle": trans.__("district2CoventSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_covent_garden"
        }
      ]
    },
    {
      "title": trans.__("district2Soho"),
      "image_url": "https://api.marco-app.com/api/image/minSoho.jpg",
      "subtitle": trans.__("district2SohoSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_soho"
        }
      ]
    },
  ];
}

module.exports = district2;