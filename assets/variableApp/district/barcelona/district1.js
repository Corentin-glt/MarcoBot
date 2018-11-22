/**
 * Created by corentin on 29/08/2018.
 */
const district1 = (trans) => {
  return [
    {
      "title": trans.__("district3Catalunya"),
      "image_url": "https://api.marco-app.com/api/image/minPlacacatalunya.jpg",
      "subtitle": trans.__("district3CatalunyaSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_placa_catalunya"
        }
      ]
    },
    {
      "title": trans.__("district3Gothic"),
      "image_url": "https://api.marco-app.com/api/image/minGothicQuarter.jpg",
      "subtitle": trans.__("district3GothicSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_gothic_quarter"
        }
      ]
    },
    {
      "title": trans.__("district3Sagrada"),
      "image_url": "https://api.marco-app.com/api/image/minSagradaFamilia.jpg",
      "subtitle": trans.__("district3SagradaSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_sagrada_familia"
        }
      ]
    },

  ];
};

module.exports = district1;