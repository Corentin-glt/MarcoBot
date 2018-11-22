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
      "title": trans.__("district1Pigalle"),
      "image_url": "https://api.marco-app.com/api/image/minPigalle.jpg",
      "subtitle": trans.__("district1PigalleSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_pigalle"
        }
      ]
    },
    {
      "title": trans.__("district1Montparnasse"),
      "image_url": "https://api.marco-app.com/api/image/minMontpar.jpg",
      "subtitle": trans.__("district1MontparnasseSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_montparnasse"
        }
      ]
    },
    {
      "title": trans.__("district1Chinese"),
      "image_url": "https://api.marco-app.com/api/image/minChinatown.jpg",
      "subtitle": trans.__("district1ChineseSub"),
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