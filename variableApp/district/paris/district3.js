/**
 * Created by corentin on 29/08/2018.
 */
const district3 = (trans) => {
  return [
    {
      "title": trans.__("district1Montmartre"),
      "image_url": "https://api.marco-app.com/api/image/minMontmartre.jpg",
      "subtitle": trans.__("district1MontmartreSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_montmartre"
        }
      ]
    },
    {
      "title": trans.__("district1Trocadero"),
      "image_url": "https://api.marco-app.com/api/image/minTroca.jpg",
      "subtitle": trans.__("district1TrocaderoSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_trocadero"
        }
      ]
    },
    {
      "title": trans.__("district1Belleville"),
      "image_url": "https://api.marco-app.com/api/image/minBelleville.jpg",
      "subtitle": trans.__("district1BellevilleSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_belleville"
        }
      ]
    },
  ];
}

module.exports = district3;