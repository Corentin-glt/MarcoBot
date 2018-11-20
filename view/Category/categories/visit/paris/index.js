/**
 * Created by corentin on 26/09/2018.
 */
module.exports = [
  {
    title: "historical",
    image_url: "https://api.marco-app.com/api/image/minArc.jpg",
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
    image_url: "https://api.marco-app.com/api/image/minGalery.jpg",
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
    image_url: "https://api.marco-app.com/api/image/minTourEiffel.jpg",
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
    image_url: "https://api.marco-app.com/api/image/minLouvre.jpg",
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
    image_url: "https://api.marco-app.com/api/image/minStChap.jpg",
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
