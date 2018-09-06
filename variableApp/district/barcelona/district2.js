/**
 * Created by corentin on 29/08/2018.
 */
const district2 = (trans) => {
  return [
    {
      "title": trans.__("district3Raval"),
      "image_url": "https://api.marco-app.com/api/image/minRaval.jpg",
      "subtitle": trans.__("district3RavalSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_raval"
        }
      ]
    },
    {
      "title": trans.__("district3Montjuic"),
      "image_url": "https://api.marco-app.com/api/image/minMontjuic.jpg",
      "subtitle": trans.__("district3MontjuicSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_montjuic"
        }
      ]
    },
    {
      "title": trans.__("district3Barceloneta"),
      "image_url": "https://api.marco-app.com/api/image/minBarceloneta.jpg",
      "subtitle": trans.__("district3BarcelonetaSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_barceloneta"
        }
      ]
    },
    {
      "title": trans.__("district3Olympic"),
      "image_url": "https://api.marco-app.com/api/image/minOlympicPort.jpg",
      "subtitle": trans.__("district3OlympicSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_olympic_port"
        }
      ]
    },
  ];
};

module.exports = district2;