/**
 * Created by corentin on 29/08/2018.
 */
const district2 = (trans) => {
  return [
    {
      "title": trans.__("district1Champs"),
      "image_url": "https://api.marco-app.com/api/image/minChamps.jpg",
      "subtitle": trans.__("district1MaraisSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_champs_elysee"
        }
      ]
    },
    {
      "title": trans.__("district1Martin"),
      "image_url": "https://api.marco-app.com/api/image/minCanal.jpg",
      "subtitle": trans.__("district1MartinSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_canal_st_martin"
        }
      ]
    },
    {
      "title": trans.__("district1Marais"),
      "image_url": "https://api.marco-app.com/api/image/minMarais.jpg",
      "subtitle": trans.__("district1MaraisSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_marais"
        }
      ]
    },
  ];
}

module.exports = district2;