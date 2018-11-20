/**
 * Created by corentin on 26/09/2018.
 */
module.exports = [
  {
    title: "historical",
    image_url: "https://api.marco-app.com/api/image/minSagradaFamilia.jpg",
    subtitle: "historicalSub",
    buttons: [
      {
        type: "postback",
        title: "historical",
        payload: "visit_category:historical"
      }
    ]
  },
  {
    title: "secret",
    image_url: "https://api.marco-app.com/api/image/SecretLondon.jpg",
    subtitle: "secretSub",
    buttons: [
      {
        type: "postback",
        title: "secret",
        payload: "visit_category:secret"
      }
    ]
  },
  {
    title: "mustSee",
    image_url: "https://api.marco-app.com/api/image/minPlacacatalunya.jpg",
    subtitle: "mustSeeSub",
    buttons: [
      {
        type: "postback",
        title: "mustSee",
        payload: "visit_category:mustsee"
      }
    ]
  },
  {
    title: "cultural",
    image_url: "https://api.marco-app.com/api/image/CulturalBarcelona.jpg",
    subtitle: "culturalSub",
    buttons: [
      {
        type: "postback",
        title: "cultural",
        payload: "visit_category:cultural"
      }
    ]
  },
  {
    title: "other",
    image_url: "https://api.marco-app.com/api/image/OtherBarcelona.jpg",
    subtitle: "otherSub",
    buttons: [
      {
        type: "postback",
        title: "other",
        payload: "visit_category:other"
      }
    ]
  }
];
