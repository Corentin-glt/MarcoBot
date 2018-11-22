/**
 * Created by corentin on 29/08/2018.
 */
const district1 = (trans) => {
  return [
    {
      "title": trans.__("district1Louvre"),
      "image_url": "https://api.marco-app.com/api/image/minLouvreDistrict.jpg",
      "subtitle": trans.__("district1LouvreSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_louvre"
        }
      ]
    },
    {
      "title": trans.__("district1Latin"),
      "image_url": "https://api.marco-app.com/api/image/minLatin.jpg",
      "subtitle": trans.__("district1LatinSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_latin_quarter"
        }
      ]
    },
    {
      "title": trans.__("district1Eiffel"),
      "image_url": "https://api.marco-app.com/api/image/minEiffelDistrict.jpg",
      "subtitle": trans.__("district1EiffelSub"),
      "buttons": [
        {
          "type": "postback",
          "title": "Gooooo! 🚀",
          "payload": "AROUND_eiffel_tour"
        }
      ]
    },
  ];
}

module.exports = district1;