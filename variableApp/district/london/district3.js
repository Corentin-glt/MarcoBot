/**
 * Created by corentin on 29/08/2018.
 */
const district3 = (trans) => {
  return [
    {
      "title": trans.__("district2Kesington"),
      "image_url": "https://api.marco-app.com/api/image/minKensington.jpg",
      "subtitle": trans.__("district2KesingtonSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_kensington"
        }
      ]
    },
    {
      "title": trans.__("district2Chelsea"),
      "image_url": "https://api.marco-app.com/api/image/minChelsea.jpg",
      "subtitle": trans.__("district2ChelseaSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_chelsea"
        }
      ]
    },
  ];
};

module.exports = district3;