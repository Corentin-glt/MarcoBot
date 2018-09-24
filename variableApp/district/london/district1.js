/**
 * Created by corentin on 29/08/2018.
 */
const district1 = (trans) => {
  return [
    {
      "title": trans.__("district2City"),
      "image_url": "https://api.marco-app.com/api/image/minCity.jpg",
      "subtitle": trans.__("district2CitySub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_city"
        }
      ]
    },
    {
      "title": trans.__("district2Camden"),
      "image_url": "https://api.marco-app.com/api/image/minCamden.jpg",
      "subtitle": trans.__("district2CamdenSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_camden"
        }
      ]
    },
    {
      "title": trans.__("district2Notting"),
      "image_url": "https://api.marco-app.com/api/image/minNottingHill.jpg",
      "subtitle": trans.__("district2NottingSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_notting_hill"
        }
      ]
    },
  ];
}


module.exports = district1;