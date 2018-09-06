/**
 * Created by corentin on 29/08/2018.
 */

const district4 = (trans) => {
  return [
    {
      "title": trans.__("district1Belleville"),
      "image_url": "https://api.marco-app.com/api/image/minBastille.jpg",
      "subtitle": trans.__("district1BellevilleSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_bastille"
        }
      ]
    },
    {
      "title": "Pigalle",
      "image_url": "https://api.marco-app.com/api/image/minPigalle.jpg",
      "subtitle": "The hottest neighbourhood of Paris.",
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_pigalle"
        }
      ]
    },
    {
      "title": "Montparnasse & surroundings",
      "image_url": "https://api.marco-app.com/api/image/minMontpar.jpg",
      "subtitle": "Famous for its theatres.",
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_montparnasse"
        }
      ]
    },
    {
      "title": "Chinatown",
      "image_url": "https://api.marco-app.com/api/image/minChinatown.jpg",
      "subtitle": "Famous for its asian streets and food",
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_chinese_quarter"
        }
      ]
    }
  ];
}

module.exports = district4;