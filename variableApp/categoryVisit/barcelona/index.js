/**
 * Created by corentin on 26/09/2018.
 */
const index = (trans) => {
  return [
    {
      "title": trans.__("historical"),
      "image_url": "https://api.marco-app.com/api/image/minSagradaFamilia.jpg",
      "subtitle": trans.__("historicalSub"),
      "buttons": [
        {
          "type": "postback",
          "title": trans.__("historical"),
          "payload": "SITE_HISTORICAL"
        }
      ]
    },
    {
      "title": trans.__("secret"),
      "image_url": "https://api.marco-app.com/api/image/SecretLondon.jpg",
      "subtitle": trans.__("secretSub"),
      "buttons": [
        {
          "type": "postback",
          "title": trans.__("secret"),
          "payload": "SITE_SECRET"
        }
      ]
    },
    {
      "title": trans.__("mustSee"),
      "image_url": "https://api.marco-app.com/api/image/minPlacacatalunya.jpg",
      "subtitle": trans.__("mustSeeSub"),
      "buttons": [
        {
          "type": "postback",
          "title": trans.__("mustSee"),
          "payload": "SITE_FAMOUS"
        }
      ]
    },
    {
      "title": trans.__("cultural"),
      "image_url": "https://api.marco-app.com/api/image/CulturalBarcelona.jpg",
      "subtitle": trans.__("culturalSub"),
      "buttons": [
        {
          "type": "postback",
          "title": trans.__("cultural"),
          "payload": "SITE_CULTURAL"
        }
      ]
    },
    {
      "title": trans.__("other"),
      "image_url": "https://api.marco-app.com/api/image/OtherBarcelona.jpg",
      "subtitle": trans.__("otherSub"),
      "buttons": [
        {
          "type": "postback",
          "title": trans.__("other"),
          "payload": "SITE_OTHER"
        }
      ]
    },
  ]
};

module.exports = index;