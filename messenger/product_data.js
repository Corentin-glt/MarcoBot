/**
 * Created by corentin on 02/05/2018.
 */
const Config = require("../config");
const async = require("async");
module.exports = {
  getStartedData: {
    "get_started": {
      "payload": "EVENT_GET_STARTED"
    }
  },
  menuData: {
    "persistent_menu": [
      {
        "locale": "default",
        "composer_input_disabled": false,
        "call_to_actions": [
          {
            "title": "My Account",
            "type": "nested",
            "call_to_actions": [
              {
                "title": "Info",
                "type": "postback",
                "payload": "EVENT_INFO"
              },
              {
                "type": "web_url",
                "title": "More about Marco",
                "url": "https://www.marco-app.com/",
                "webview_height_ratio": "full"
              }
            ]
          }
        ]
      }
    ]
  },
  welcomeMessage: {
    "greeting": [
      {
        "locale": "default",
        "text": "Marco is your personal travel assistant available 24h/24h on Facebook Messenger! ✈️ "
      }, {
        "locale": "en_US",
        "text": "Greeting text for en_US local !"
      }
    ]
  },
  templateList: (list, kindElement) => {
    return new Promise((resolve, reject) => {
      const arrayOfElement = [];
      async.each(list, (elem, callback) => {
        const element = {
          "title": `${elem.name}`,
          //"image_url": `${Config.category[Config.indexCategory].apiUrl}/image/${elem.photos[0]}`,
          "subtitle": "We have the right hat for everyone.",
          "buttons": [
            {
              "type": "postback",
              "title": "I want to go",
              "payload": `GOING_${kindElement}:${elem.id}`
            },
            {
              "type": "postback",
              "title": "Later",
              "payload": `LATER_${kindElement}:${elem.id}`
            },
            {
              "type": "postback",
              "title": "View more",
              "payload": `VIEWMORE_${kindElement}:${elem.id}`
            },
            // {
            //   "type": "postback",
            //   "title": "Back",
            //   "payload": `BACK`
            // },
          ]
        };
        arrayOfElement.push(element);
        callback()
      }, (err) => {
        if (err) return reject(err);
        return resolve({
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": arrayOfElement
            }
          }
        });
      })
    })
  },
  initialMessage(user) {
    return {
      "text": `Hi ${user.firstName} ! 👋 \nI'm Marco your parisian travel assistant. 🙂`
    }
  },
  missionMessage: {
    "text": `My mission is to make feel like a local in this amazing city. 🇫🇷 `
  },
  experienceMessage: {
    "text": `With me, your trip becomes a unique experience! ❤️`
  },
  myWorkMessage: {
    "text": 'Even before you think about it, I’ll instantly show you the best of Paris. You’ll be sure not to miss out on anything and stay away from tourist traps.'
  },
  excitementMessage: {
    "text": "Isn't it exciting? 🤩",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Yes let's go!",
        "payload": "EVENT_CONFIRM_EXCITEMENT",
      },
      {
        "content_type": "text",
        "title": "No I don't need you",
        "payload": "EVENT_CANCEL_EXCITEMENT",
      }
    ]
  },
  defaultPostback: {
    "text": "Mmmh, there seems to be a problem..."
  },
  letsGoMessage: {
    "text": "Awesome!! 👌🚀"
  },
  noNeedMessage: {
    "text": "Oh! That's a shame! 😢"
  },
  preFeedback: {
    "text": "Nevertheless, I'd love to know why I can't help you..."
  },
  feedbackInput: {
    "text": "Could you tell me? "
  },
  preQuestionMessage: {
    "text": "Just before starting with your personalized travel experience, I'd like to ask you some questions. 🤓 Just between you and me, 🤫 with who are you traveling?",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "😇 I'm Alone",
        "payload": "EVENT_ALONE",
      },
      {
        "content_type": "text",
        "title": "❤️ With my partner",
        "payload": "EVENT_PARTNER",
      },
      {
        "content_type": "text",
        "title": "🎉 With friends",
        "payload": "EVENT_FRIENDS",
      },
      {
        "content_type": "text",
        "title": "👨‍👩‍👧‍👦 With my family",
        "payload": "EVENT_FAMILY",
      }
    ]
  },
  question1Message: {
    "text": "So, what's your mood?",
    "quick_replies": [
      {
        "content_type": "text",
        "title": "Visiting",
        "payload": "EVENT_SITE",
      },
      {
        "content_type": "text",
        "title": "I'm hungry",
        "payload": "EVENT_REST",
      },
      {
        "content_type": "text",
        "title": "I'm thirsty",
        "payload": "EVENT_BAR",
      },
      {
        "content_type": "text",
        "title": "Districts",
        "payload": "EVENT_DISTRICT",
      }
    ]
  },
  selectionSite: {
    "text": "Great choice! 🎉",
  },
  selectionSite2: {
    "text": "But wait, what type of visits are you interested in? "
  },
  selectionSiteType: {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Historical",
            "image_url": "https://api.marco-app.com/api/image/minArc.jpg",
            "subtitle": "Part of the french heritage.",
            "buttons": [
             {
                "type":"postback",
                "title":"Historical",
                "payload":"SITE_HISTORICAL"
              }
            ]
          },
          {
            "title": "Secret",
            "image_url": "https://api.marco-app.com/api/image/minGalery.jpg",
            "subtitle": "Atypical and hidden places to discover the authentic Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"Secret",
                "payload":"SITE_SECRET"
              }
            ]
          },
          {
            "title": "Must sees",
            "image_url": "https://api.marco-app.com/api/image/minTourEiffel.jpg",
            "subtitle": "All the must sees of Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"Famous",
                "payload":"SITE_FAMOUS"
              }
            ]
          },
          {
            "title": "Cultural",
            "image_url": "https://api.marco-app.com/api/image/minStChap.jpg",
            "subtitle": "Paris is full of beautiful churches.",
            "buttons": [
              {
                "type":"postback",
                "title":"Cultural",
                "payload":"SITE_CULTURAL"
              }
            ]
          },
        ]
      }
    }
  },
  selectionBar: {
    "text": "Cheers! 🍸",
  },
  selectionBar2: {
      "text": "But wait, what type of bars do you like? "
  },
  selectionBarType: {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Trendy",
            "image_url": "https://api.marco-app.com/api/image/minTrendy.jpg",
            "subtitle": "Perfect for a saturday night.",
            "buttons": [
              {
                "type":"postback",
                "title":"Trendy",
                "payload":"BAR_TRENDY"
              }
            ]
          },
          {
            "title": "Atypical",
            "image_url": "https://api.marco-app.com/api/image/minAtypicalBar.jpg",
            "subtitle": "Perfect for discovering new places to drink a cocktail.",
            "buttons": [
              {
                "type":"postback",
                "title":"Atypical",
                "payload":"BAR_ATYPICAL"
              }
            ]
          },
          {
            "title": "High class",
            "image_url": "https://api.marco-app.com/api/image/minHighClass.jpg",
            "subtitle": "The prettiest bars of Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"High class",
                "payload":"BAR_HIGHCLASS"
              }
            ]
          },
          {
            "title": "Pubs",
            "image_url": "https://api.marco-app.com/api/image/minPub.jpg",
            "subtitle": "Let's go watch the wolrd cup tonight.",
            "buttons": [
              {
                "type":"postback",
                "title":"Pubs",
                "payload":"BAR_PUB"
              }
            ]
          },
          {
            "title": "Cafés",
            "image_url": "https://api.marco-app.com/api/image/minCafe.jpg",
            "subtitle": "Enjoy a terasse on a nice sunny afternoon.",
            "buttons": [
              {
                "type":"postback",
                "title":"Cafés",
                "payload":"BAR_PUB"
              }
            ]
          },
          {
            "title": "Wine bars",
            "image_url": "https://api.marco-app.com/api/image/minWineBar.jpg",
            "subtitle": "Perfect for tasting famous wines.",
            "buttons": [
              {
                "type":"postback",
                "title":"Wine bars",
                "payload":"BAR_WINE"
              }
            ]
          },

        ]
      }
    }
  },
  selectionRestaurant: {
    "text": "Yummy! 🍽",
  },
  selectionRestaurant2: {
      "text": "But wait, tell me more about what type of place you’re looking for:"
  },
  selectionRestaurantType: {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "generic",
        "elements": [
          {
            "title": "Gastronomic",
            "image_url": "https://api.marco-app.com/api/image/minGastronomy.jpg",
            "subtitle": "The finest french cuisine from incredible chefs.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gastronomic",
                "payload":"REST_GASTRONOMY"
              }
            ]
          },
          {
            "title": "Veggie",
            "image_url": "https://api.marco-app.com/api/image/minVeggie.jpg",
            "subtitle": "The best of healthy food.",
            "buttons": [
              {
                "type":"postback",
                "title":"Atypical",
                "payload":"REST_VEGGIE"
              }
            ]
          },
          {
            "title": "Brunch",
            "image_url": "https://api.marco-app.com/api/image/minBrunch.jpg",
            "subtitle": "A typical parisian sunday breakfast.",
            "buttons": [
              {
                "type":"postback",
                "title":"Brunch",
                "payload":"REST_BRUNCH"
              }
            ]
          },
          {
            "title": "Street food",
            "image_url": "https://api.marco-app.com/api/image/minStreetfood.jpg",
            "subtitle": "The finest ready to eat parisian food.",
            "buttons": [
              {
                "type":"postback",
                "title":"Street food",
                "payload":"REST_STREET"
              }
            ]
          },
          {
            "title": "Traditional",
            "image_url": "https://api.marco-app.com/api/image/minTraditional.jpg",
            "subtitle": "Typical french food and restaurants.",
            "buttons": [
              {
                "type":"postback",
                "title":"Traditional",
                "payload":"REST_TRADI"
              }
            ]
          },
          {
            "title": "Restaurants",
            "image_url": "https://api.marco-app.com/api/image/minRestaurant.jpg",
            "subtitle": "Perfect for tasting famous wines.",
            "buttons": [
              {
                "type":"postback",
                "title":"Restaurants",
                "payload":"REST_REST"
              }
            ]
          },

        ]
      }
    }
  },
  selectionDistrict: {
    "text": "Gooooo! 🚀",
  },
  selectionDistrict2: {
      "text": "But wait, I don't know where you'd like to go... Could you choose a district ?:"
  },
  selectionDistrictType: {
    "attachment": {
      "type": "template",
      "payload": {
        "template_type": "list",
        "top_elemennt_style": "compact",
        "elements": [
          {
            "title": "Around Le Louvre",
            "image_url": "https://api.marco-app.com/api/image/minLouvreDistrict.jpg",
            "subtitle": "Center of Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_LOUVRE"
              }
            ]
          },
          {
            "title": "Le Marais district",
            "image_url": "https://api.marco-app.com/api/image/minMarais.jpg",
            "subtitle": "Historical disctrict of Paris full of high-end boutiques.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_MARAIS"
              }
            ]
          },
          {
            "title": "Latin quarter",
            "image_url": "https://api.marco-app.com/api/image/minLatin.jpg",
            "subtitle": "The left bank's true student & intellectual center.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_LATIN"
              }
            ]
          },
          {
            "title": "Around the Tour Eiffel",
            "image_url": "https://api.marco-app.com/api/image/minEiffelDistrict.jpg",
            "subtitle": "Hidden behind walls you'll find embassies and institutional buildings.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_EIFFEL"
              }
            ]
          },
          {
            "title": "The Champs Elysée surroundings",
            "image_url": "https://api.marco-app.com/api/image/minChamps.jpg",
            "subtitle": "The golden triangle famous for its luxurious shops.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_CHAMPS"
              }
            ]
          },
          {
            "title": "Canal st martin district",
            "image_url": "https://api.marco-app.com/api/image/minCanal.jpg",
            "subtitle": "Famous for being hype!",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_MARTIN"
              }
            ]
          },
          {
            "title": "Around Bastille",
            "image_url": "https://api.marco-app.com/api/image/minBastille.jpg",
            "subtitle": "From nightfall to early morning streets are crowded with young people.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_BASTILLE"
              }
            ]
          },
          {
            "title": "Pigalle",
            "image_url": "https://api.marco-app.com/api/image/minPigalle.jpg",
            "subtitle": "The hottest neighbourhood of Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_PIGALLE"
              }
            ]
          },
          {
            "title": "Montmartre",
            "image_url": "https://api.marco-app.com/api/image/minMontmartre.jpg",
            "subtitle": "Famous artistic hill of Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_MONTMARTRE"
              }
            ]
          },
          {
            "title": "Trocadéro surroundings",
            "image_url": "https://api.marco-app.com/api/image/minTrocadero.jpg",
            "subtitle": "Famous artistic hill of Paris.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_MONTMARTRE"
              }
            ]
          },
          {
            "title": "Belleville",
            "image_url": "https://api.marco-app.com/api/image/minBelleville.jpg",
            "subtitle": "Historically the rural & working class neighbourhood.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_BELLEVILLE"
              }
            ]
          },
          {
            "title": "Montparnasse & surroundings",
            "image_url": "https://api.marco-app.com/api/image/minMontparnasse.jpg",
            "subtitle": "Famous for its theatres.",
            "buttons": [
              {
                "type":"postback",
                "title":"Gooooo! 🚀",
                "payload":"AROUND_MONTPARNASSE"
              }
            ]
          }

        ]
      }
    }
  },

}
;