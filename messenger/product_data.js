/**
 * Created by corentin on 02/05/2018.
 */
const Config = require("../config");
const async = require("async");
const anecdotes = require('../variableApp/anecdotes/index');
const ARRAYDAY = ["sunday", "monday", "tuesday", "wednesday", "thursday",
  "friday", "saturday"];
const numberDayString = ['', 'first', 'second', 'third', 'fourth', 'fifth'];
const numberDayStringFR = ['', 'premier', 'deuxième', 'troisième', 'quatrième', 'cinquième'];
const indexElementDistrict = require('../variableApp/district/index');
const limitPageDistrict = require('../variableApp/district/limit');
const indexCategoryVisit = require('../variableApp/categoryVisit/index');

const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});

class MessageData {
  constructor(locale) {
    this.locale = locale;
    i18n.setLocale(locale);
  }

  generateSubtitle(elem, TODAY) {
    return new Promise((resolve, reject) => {
      let money = "";
      switch (elem.priceRange) {
        case 0:
          money = i18n.__("templatePrice");
          break;
        case 1:
          money = "💰";
          break;
        case 2:
          money = "💰💰";
          break;
        case 3:
          money = "💰💰";
          break;
        case 4:
          money = "💰💰💰";
          break;
        default:
          money = i18n.__("templatePrice");
          break;
      }
      let schedule = "🕐 ";
      const daySchedule = (elem.schedule &&
      elem.schedule[ARRAYDAY[TODAY.getDay()]] !== null) ?
        elem.schedule[ARRAYDAY[TODAY.getDay()]] : [];
      if (daySchedule.length > 0) {
        daySchedule.map((day, i) => {
          schedule = (day.start === "12:00 am" && day.end === "12:00 pm") ?
            schedule.concat(i18n.__("templateOpen"))
            : schedule.concat(day.start, ' - ', day.end, ' ');
          if (i === daySchedule.length - 1) {
            resolve({schedule: schedule, money: money});
          }
        })
      } else {
        schedule = i18n.__("templateClose");
        resolve({schedule: schedule, money: money});
      }
    });
  };

  get getStartedData() {
    return {
      "get_started": {
        "payload": "INIT"
      }
    }
  }

  get menuData() {
    return {
      "persistent_menu": [
        {
          "locale": "default",
          "composer_input_disabled": false,
          "call_to_actions": [
            {
              "title": "👤 My account",
              "type": "nested",
              "call_to_actions": [
                {
                  "title": "🔄 Switch city",
                  "type": "postback",
                  "payload": "CHANGEMYCITY"
                },
                {
                  "title": "🗺 New trip",
                  "type": "postback",
                  "payload": "NEWTRIP"
                },
                {
                  "title": "🧡 My favorites",
                  "type": "postback",
                  "payload": "MYFAVORITE_0"
                },
              ]
            },
            {
              "title": "🛎 Service",
              "type": "nested",
              "call_to_actions": [
                {
                  "title": "Help",
                  "type": "postback",
                  "payload": "HELP"
                },
                {
                  "title": "Subscription",
                  "type": "postback",
                  "payload": "SUBSCRIPTION"
                },
                {
                  "title": "Restart",
                  "type": "postback",
                  "payload": "INIT"
                }
              ]
            },
            {
              "title": "💌 Invite a friend",
              "type": "postback",
              "payload": "INVITE"
            },
          ]
        },
        {
          "locale": "en_US",
          "composer_input_disabled": false,
          "call_to_actions": [
            {
              "title": "👤 My account",
              "type": "nested",
              "call_to_actions": [
                {
                  "title": "🔄 Switch city",
                  "type": "postback",
                  "payload": "CHANGEMYCITY"
                },
                {
                  "title": "🗺 New trip",
                  "type": "postback",
                  "payload": "NEWTRIP"
                },
                {
                  "title": "🧡 My favorites",
                  "type": "postback",
                  "payload": "MYFAVORITE_0"
                },
              ]
            },
            {
              "title": "🛎 Service",
              "type": "nested",
              "call_to_actions": [
                {
                  "title": "Help",
                  "type": "postback",
                  "payload": "HELP"
                },
                {
                  "title": "Subscription",
                  "type": "postback",
                  "payload": "SUBSCRIPTION"
                },
                {
                  "title": "Restart",
                  "type": "postback",
                  "payload": "INIT"
                }
              ]
            },
            {
              "title": "💌 Invite a friend",
              "type": "postback",
              "payload": "INVITE"
            },
          ]
        },
        {
          "locale": "fr_FR",
          "composer_input_disabled": false,
          "call_to_actions": [
            {
              "title": "👤 Profil",
              "type": "nested",
              "call_to_actions": [
                {
                  "title": "🔄 Changer de ville",
                  "type": "postback",
                  "payload": "CHANGEMYCITY"
                },
                {
                  "title": "🗺 Nouveau voyage",
                  "type": "postback",
                  "payload": "NEWTRIP"
                },
                {
                  "title": "🧡 Mes favoris",
                  "type": "postback",
                  "payload": "MYFAVORITE_0"
                },
              ]
            },
            {
              "title": "🛎 Service",
              "type": "nested",
              "call_to_actions": [
                {
                  "title": "Aide",
                  "type": "postback",
                  "payload": "HELP"
                },
                {
                  "title": "Notifications",
                  "type": "postback",
                  "payload": "SUBSCRIPTION"
                },
                {
                  "title": "Recommencer",
                  "type": "postback",
                  "payload": "INIT"
                }
              ]
            },
            {
              "title": "💌 Inviter un ami",
              "type": "postback",
              "payload": "INVITE"
            },
          ]
        }
      ]
    }
  }

  get wouldYouSubOrUnsub() {
    return {
      "text": i18n.__("wouldYouSubOrUnsub"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": `${i18n.__("subscribe")} 👍`,
          "payload": "SUBSCRIBE_",
        },
        {
          "content_type": "text",
          "title": `${i18n.__("unsubscribe")} 👎`,
          "payload": "UNSUBSCRIBE_",
        }
      ]
    };
  }

  get welcomeMessage() {
    return {
      "greeting": [
        {
          "locale": "default",
          "text": "Marco is your personal travel assistant available 24h/24h on Facebook Messenger! ✈️ "
        }, {
          "locale": "en_US",
          "text": "Marco is your personal travel assistant available 24h/24h on Facebook Messenger! ✈️"
        },
        {
          "locale": "fr_FR",
          "text": "Marco est ton assistant personnel de voyage disponible 24h/24h sur Facebook Messenger! ✈️️"
        }
      ]
    };
  }

  templateList(list, kindElement, page, whichApi, category = '',
               price = 0) {
    return new Promise((resolve, reject) => {
      const TODAY = new Date();
      const arrayOfElement = [];
      async.each(list, (elem, callback) => {
        this.generateSubtitle(elem, TODAY)
          .then(res => {
            const elemLocationGoogleMap = elem.location.name.replace(" ", "+");
            const globalNote = elem.note && elem.note !== null && typeof elem.note !== 'undefined' ?
              `🌟${elem.note}` : '';
            let globalTypes = '';
            elem.types.map((elem, index) => {
              index === 0 ?
                globalTypes = `${elem}`
                :
                globalTypes = `${globalTypes}, ${elem}`
            });
            globalTypes.length > 30 ?
              globalTypes = globalTypes.slice(0, 30) + '...'
              : null;
            let globalUrl = elem.url;
            globalUrl.includes('https://') ? null : globalUrl = `https://${globalUrl}`;

            let hasDescription = (elem.description.length > 0 && this.locale !== 'fr')
            || (elem.descriptionFr.length > 0 && this.locale === 'fr') ?
              {
                "type": "postback",
                "title": i18n.__("tellMore"),
                "payload": `VIEWMORE_${kindElement}:${elem.id || elem._id}`
              }
              :
              {
                "title": i18n.__("tellMore"),
                "type": "web_url",
                "url": `${globalUrl}`,
              };
            let isAffiliate = elem.affiliations.length > 0 ?
              {
                "type": "web_url",
                "url": `${elem.affiliations[0].url}`,
                "title": i18n.__("reservationTemplate")
              }
              :
              hasDescription;
            const element = {
              "title": `${elem.name}${globalNote}`,
              "image_url": `https://api.marco-app.com/api/image/${elem.photos[0]}`,
              "subtitle": `${globalTypes}\n${res.money}\n ${res.schedule}`,
              "default_action": {
                "type": "web_url",
                "url": `${globalUrl}`,
              },
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("letsGo"),
                  "payload": `GOING_${kindElement}:${elem.id || elem._id}`
                },
                {
                  "type": "element_share",
                  "share_contents": {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": [
                          {
                            "title": `${elem.name}`,
                            "subtitle": `📍 ${elem.location.name} \n${res.money}\n ${res.schedule}`,
                            "image_url": `https://api.marco-app.com/api/image/${elem.photos[0]}`,
                            "default_action": {
                              "type": "web_url",
                              "url": "https://www.messenger.com/t/meethellomarco?ref=share_card",

                            },
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": `https://www.google.fr/maps/place/${elemLocationGoogleMap}`,
                                "title": i18n.__("whereShare")
                              },
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                isAffiliate,
              ]
            };
            arrayOfElement.push(element);
            callback()
          })
          .catch(() => callback("AILLE"))
      }, (err) => {
        if (err) return reject(err);
        if (arrayOfElement.length === 5) {
          const NEXT_PAGE = whichApi === "neo4j" ?
            `NEXTPAGENEO4J_${category}_${price}` : "NEXTPAGEEVENT";
          const morePage = {
            "title": i18n.__("seeMore"),
            "subtitle": i18n.__("seeMoreSub"),
            "image_url": `https://api.marco-app.com/api/image/FBProfileRe.png`,
            "buttons": [
              {
                "type": "postback",
                "title": i18n.__("seeMoreButton"),
                "payload": `${NEXT_PAGE}_${kindElement}:${parseInt(page) + 1}`
              },
            ]
          };
          arrayOfElement.push(morePage)
        } else {
          const talkWithHuman = {
            "title": i18n.__("nothingStock"),
            "subtitle": i18n.__("nothingStockSub"),
            "image_url": `https://api.marco-app.com/api/image/askInformation.jpg`,
            "buttons": [
              {
                "type": "postback",
                "title": i18n.__("nothingStockButton"),
                "payload": `SEARCH_HUMAN`
              },
            ]
          };
          arrayOfElement.push(talkWithHuman)
        }
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
  }

  templateListFromDifferentEvent(list, page, district, whichApi,
                                 category = '') {
    return new Promise((resolve, reject) => {
      const TODAY = new Date();
      const arrayOfElement = [];
      async.each(list, (elem, callback) => {
        this.generateSubtitle(elem, TODAY)
          .then(res => {
            const elemLocationGoogleMap = elem.location.name.replace(" ", "+")
            const globalNote = elem.note && elem.note !== null && typeof elem.note !== 'undefined' ?
              `🌟${elem.note}` : '';
            let globalTypes = '';
            elem.types.map((elem, index) => {
              index === 0 ?
                globalTypes = `${elem}`
                :
                globalTypes = `${globalTypes}, ${elem}`
            });
            globalTypes.length > 30 ?
              globalTypes = globalTypes.slice(0, 30) + '...'
              : null;
            let globalUrl = elem.url;
            globalUrl.includes('https://') ? null : globalUrl = `https://${globalUrl}`;
            let hasDescription = (elem.description.length > 0 && this.locale !== 'fr')
            || (elem.descriptionFr.length > 0 && this.locale === 'fr') ?
              {
                "type": "postback",
                "title": i18n.__("tellMore"),
                "payload": `VIEWMORE_${elem.kindElement}:${elem.id || elem._id}`
              }
              :
              {
                "title": i18n.__("tellMore"),
                "type": "web_url",
                "url": `${globalUrl}`,
              };
            let isAffiliate = elem.affiliations.length > 0 ?
              {
                "type": "web_url",
                "url": `${elem.affiliations[0].url}`,
                "title": i18n.__("reservationTemplate")
              }
              :
              hasDescription;
            const element = {
              "title": `${elem.name}${globalNote}`,
              "image_url": `https://api.marco-app.com/api/image/${elem.photos[0]}`,
              "subtitle": `${globalTypes}\n${res.money}\n ${res.schedule}`,
              "default_action": {
                "type": "web_url",
                "url": `${globalUrl}`,
              },
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("letsGo"),
                  "payload": `GOING_${elem.kindElement}:${elem.id || elem._id}`
                },
                {
                  "type": "element_share",
                  "share_contents": {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": [
                          {
                            "title": `${elem.name}`,
                            "subtitle": `📍 ${elem.location.name} \n${res.money}\n ${res.schedule}`,
                            "image_url": `https://api.marco-app.com/api/image/${elem.photos[0]}`,
                            "default_action": {
                              "type": "web_url",
                              "url": "https://www.messenger.com/t/meethellomarco?ref=share_card",

                            },
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": `https://www.google.fr/maps/place/${elemLocationGoogleMap}`,
                                "title": i18n.__("whereShare")
                              },
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                isAffiliate,
              ]
            };
            arrayOfElement.push(element);
            callback()
          })
          .catch(() => callback("NIKE AILLE"))
      }, (err) => {
        if (err) return reject(err);
        if (arrayOfElement.length === 5) {
          const NEXT_PAGE = whichApi === "neo4j" ?
            `NEXTPAGEDIFFEVENTNEO4J_${category}` :
            `NEXTPAGEDIFFEVENT_${district}`;
          const morePage = {
            "title": i18n.__("seeMore"),
            "subtitle": i18n.__("seeMoreSub"),
            "image_url": `https://api.marco-app.com/api/image/FBProfileRe.png`,
            "buttons": [
              {
                "type": "postback",
                "title": i18n.__("seeMoreButton"),
                "payload": `${NEXT_PAGE}:${parseInt(page) + 1}`
              },
            ]
          };
          arrayOfElement.push(morePage)
        } else {
          const talkWithHuman = {
            "title": i18n.__("nothingStock"),
            "subtitle": i18n.__("nothingStockSub"),
            "image_url": `https://api.marco-app.com/api/image/askInformation.jpg`,
            "buttons": [
              {
                "type": "postback",
                "title": i18n.__("nothingStockButton"),
                "payload": `SEARCH_HUMAN`
              },
            ]
          };
          arrayOfElement.push(talkWithHuman)
        }
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
  }

  templateLaterView(list, page) {
    return new Promise((resolve, reject) => {
      const TODAY = new Date();
      const arrayOfElement = [];
      async.each(list, (elem, callback) => {
        this.generateSubtitle(elem, TODAY)
          .then(res => {
            const elemLocationGoogleMap = elem.location.name.replace(" ", "+");
            const globalNote = elem.note && elem.note !== null && typeof elem.note !== 'undefined' ?
              `🌟${elem.note}` : '';
            let globalTypes = '';
            elem.types.map((elem, index) => {
              index === 0 ?
                globalTypes = `${elem}`
                :
                globalTypes = `${globalTypes}, ${elem}`
            });
            globalTypes.length > 30 ?
              globalTypes = globalTypes.slice(0, 30) + '...'
              : null;
            let globalUrl = elem.url;
            globalUrl.includes('https://') ? null : globalUrl = `https://${globalUrl}`;
            let hasDescription = (elem.description.length > 0 && this.locale !== 'fr')
            || (elem.descriptionFr.length > 0 && this.locale === 'fr') ?
              {
                "type": "postback",
                "title": i18n.__("tellMore"),
                "payload": `VIEWMORE_${elem.kindElement}:${elem.id || elem._id}`
              }
              :
              {
                "title": i18n.__("tellMore"),
                "type": "web_url",
                "url": `${globalUrl}`,
              };
            let isAffiliate = elem.affiliations.length > 0 ?
              {
                "type": "web_url",
                "url": `${elem.affiliations[0].url}`,
                "title": i18n.__("reservationTemplate")
              }
              :
              hasDescription;
            const element = {
              "title": `${elem.name}${globalNote}`,
              "image_url": `https://api.marco-app.com/api/image/${elem.photos[0]}`,
              "subtitle": `${globalTypes}\n${res.money}\n ${res.schedule}`,
              "default_action": {
                "type": "web_url",
                "url": `${globalUrl}`,
              },
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("letsGo"),
                  "payload": `GOING_${elem.kindElement}:${elem.id || elem._id}`
                },
                {
                  "type": "element_share",
                  "share_contents": {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": [
                          {
                            "title": `${elem.name}`,
                            "subtitle": `📍 ${elem.location.name} \n${res.money}\n ${res.schedule}`,
                            "image_url": `https://api.marco-app.com/api/image/${elem.photos[0]}`,
                            "default_action": {
                              "type": "web_url",
                              "url": "https://www.messenger.com/t/meethellomarco?ref=share_card",

                            },
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": `https://www.google.fr/maps/place/${elemLocationGoogleMap}`,
                                "title": i18n.__("whereShare")
                              },
                            ]
                          }
                        ]
                      }
                    }
                  }
                },
                isAffiliate,
              ]
            };
            arrayOfElement.push(element);
            callback()
          })
          .catch(() => callback("AILLE"))
      }, (err) => {
        if (err) return reject(err);
        if (arrayOfElement.length === 5) {
          const morePage = {
            "title": i18n.__("seeMore"),
            "subtitle": i18n.__("seeMoreSub"),
            "image_url": `https://api.marco-app.com/api/image/FBProfileRe.png`,
            "buttons": [
              {
                "type": "postback",
                "title": i18n.__("seeMoreButton"),
                "payload": `MYFAVORITE_${parseInt(page) + 1}`
              },
            ]
          };
          arrayOfElement.push(morePage)
        }
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
  }

  initialMessage(user) {
    return {
      "text": i18n.__('initialMessage') + `${user.firstName} ! 👋 \n` + i18n.__('initialMessageBis')
    }
  }

  get initialMessage2() {
    return {
      "text": i18n.__('initialMessage2')
    };
  }

  get initialMessage3() {
    return {
      "text": i18n.__('initialMessage3')
    };
  }

  get missionMessage2() {
    return {
      "text": i18n.__("missionMessage2")
    };
  }

  get whichCity() {
    return {
      "text": i18n.__("whichCity"),
    }
  }

  get whichCity2() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": `🇫🇷🇫🇷 ${i18n.__('paris')} 🇫🇷🇫🇷`,
              "image_url": `https://api.marco-app.com/api/image/paris.jpg`,
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("validate"),
                  "payload": `TRAVELINGTO_PARIS`
                },
              ]
            },
            {
              "title": `🇬🇧🇬🇧 ${i18n.__('london')} 🇬🇧🇬🇧`,
              "image_url": `https://api.marco-app.com/api/image/london.jpg`,
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("validate"),
                  "payload": `TRAVELINGTO_LONDON`
                },
              ]
            },
            {
              "title": `🇪🇸🇪🇸 ${i18n.__('barcelona')} 🇪🇸🇪🇸`,
              "image_url": `https://api.marco-app.com/api/image/barcelona.jpg`,
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("validate"),
                  "payload": `TRAVELINGTO_BARCELONA`
                },
              ]
            },
            // {
            //   "title": `🇵🇹🇵🇹 ${i18n.__('lisbon')} 🇵🇹🇵🇹`,
            //   "image_url": `https://api.marco-app.com/api/image/lisbon.png`,
            //   "buttons": [
            //     {
            //       "type": "postback",
            //       "title": i18n.__("validate"),
            //       "payload": `TRAVELINGTO_LISBON`
            //     },
            //   ]
            // },
            // {
            //   "title": `🇮🇹🇮🇹 ${i18n.__('rome')} 🇮🇹🇮🇹`,
            //   "image_url": `https://api.marco-app.com/api/image/roma.jpg`,
            //   "buttons": [
            //     {
            //       "type": "postback",
            //       "title": i18n.__("validate"),
            //       "payload": `TRAVELINGTO_ROME`
            //     },
            //   ]
            // },
            // {
            //   "title": `🇩🇪🇩🇪 ${i18n.__('berlin')} 🇩🇪🇩🇪`,
            //   "image_url": `https://api.marco-app.com/api/image/berlin.jpg`,
            //   "buttons": [
            //     {
            //       "type": "postback",
            //       "title": i18n.__("validate"),
            //       "payload": `TRAVELINGTO_BERLIN`
            //     },
            //   ]
            // }
          ]
        }
      }
    }
  }

  get forgetCity() {
    return {
      "text": `${i18n.__("forgetCity")}`,
    }
  }

  isItFirstTime(city) {
    const cityAttribute = city.toLowerCase();
    return {
      "text": `${i18n.__("isItFirstTime")} ${i18n.__(cityAttribute)} ?`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": "✅",
          "payload": `FIRSTTIME_YES`,
        },
        {
          "content_type": "text",
          "title": "❌",
          "payload": "FIRSTTIME_NO",
        },
      ]
    };
  }

  whenAreYouArriving(boolean, city) {
    const cityAttribute = city.toLowerCase();
    return {
      "text": (boolean) ?
        `${i18n.__("whenAreYouArrivingPart1")}\n${i18n.__("whenAreYouArrivingPart2")} \n\n${i18n.__("whenAreYouArrivingPart3")} ${i18n.__(cityAttribute)} ${i18n.__("whenAreYouArrivingPart4")}\n\n${i18n.__("whenAreYouArrivingPart5")}${i18n.__(cityAttribute)}${i18n.__("whenAreYouArrivingPart6")}`
        :
        `${i18n.__("whenAreYouArrivingPart7")} ${i18n.__("whenAreYouArrivingPart2")} \n\n${i18n.__("whenAreYouArrivingPart3")} ${i18n.__(cityAttribute)}${i18n.__("whenAreYouArrivingPart4")}\n\n${i18n.__("whenAreYouArrivingPart5")}${i18n.__(cityAttribute)}${i18n.__("whenAreYouArrivingPart6")}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": `${i18n.__("whenAreYouArrivingPart8")}${i18n.__(city)}`,
          "payload": "ALREADYINCITY",
        },
      ]
    };
  }

  whenAreYouArriving2(city) {
    const cityAttribute = city.toLowerCase();
    return {
      "text": `${i18n.__("whenAreYouArriving2Part1")} ${i18n.__(cityAttribute)} ${i18n.__("whenAreYouArriving2Part2")} \n\n ${i18n.__(cityAttribute)} ${i18n.__("whenAreYouArriving2Part3")}\n\n${i18n.__("whenAreYouArrivingPart5")} ${i18n.__(cityAttribute)}${i18n.__("whenAreYouArrivingPart6")}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": `${i18n.__("whenAreYouArrivingPart8")}${i18n.__(cityAttribute)}`,
          "payload": "ALREADYINCITY",
        },
      ]
    };
  }

  howManyDayAreStaying(city) {
    const cityAttribute = city.toLowerCase();
    return {
      "text": `${i18n.__("howManyDayAreStaying1")} ${i18n.__(cityAttribute)} ${i18n.__("howManyDayAreStaying2")}`,
    }
  }

  updateCityDone(city) {
    const lowerCity = city.toLowerCase();
    return {
      "text": `${i18n.__("updateCityDone")} ${i18n.__(lowerCity)} ✅`,
    }
  }

  get changeMyCity() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": `🇫🇷🇫🇷 ${i18n.__('paris')} 🇫🇷🇫🇷`,
              "image_url": `https://api.marco-app.com/api/image/paris.jpg`,
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("validate"),
                  "payload": `MODIFYCITY_PARIS`
                },
              ]
            },
            {
              "title": `🇬🇧🇬🇧 ${i18n.__('london')} 🇬🇧🇬🇧`,
              "image_url": `https://api.marco-app.com/api/image/london.jpg`,
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("validate"),
                  "payload": `MODIFYCITY_LONDON`
                },
              ]
            },
            {
              "title": `🇪🇸🇪🇸 ${i18n.__('barcelona')} 🇪🇸🇪🇸`,
              "image_url": `https://api.marco-app.com/api/image/barcelona.jpg`,
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("validate"),
                  "payload": `MODIFYCITY_BARCELONA`
                },
              ]
            },
            // {
            //   "title": `🇵🇹🇵🇹 ${i18n.__('lisbon')} 🇵🇹🇵🇹`,
            //   "image_url": `https://api.marco-app.com/api/image/lisbon.png`,
            //   "buttons": [
            //     {
            //       "type": "postback",
            //       "title": i18n.__("validate"),
            //       "payload": `MODIFYCITY_LISBON`
            //     },
            //   ]
            // },
            // {
            //   "title": `🇮🇹🇮🇹 ${i18n.__('rome')} 🇮🇹🇮🇹`,
            //   "image_url": `https://api.marco-app.com/api/image/roma.jpg`,
            //   "buttons": [
            //     {
            //       "type": "postback",
            //       "title": i18n.__("validate"),
            //       "payload": `MODIFYCITY_ROMA`
            //     },
            //   ]
            // },
            // {
            //   "title": `🇩🇪🇩🇪 ${i18n.__('berlin')} 🇩🇪🇩🇪`,
            //   "image_url": `https://api.marco-app.com/api/image/berlin.jpg`,
            //   "buttons": [
            //     {
            //       "type": "postback",
            //       "title": i18n.__("validate"),
            //       "payload": `MODIFYCITY_BERLIN`
            //     },
            //   ]
            // }
          ]
        }
      }
    }
  }

  noMoreCityInTrip(city) {
    const cityToUpper = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToUpper.toLowerCase();
    return {
      "text": `${i18n.__("noMoreCityInTrip1")} ${i18n.__(lowerCity)}${i18n.__("noMoreCityInTrip2")}`
    }
  }

  yourCityActual(city) {
    const cityToUpper = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToUpper.toLowerCase();
    return {
      "text": `${i18n.__("noMoreCityInTrip1")} ${i18n.__(lowerCity)} ${i18n.__("yourCityActual")} `
    }
  }

  get arrivalLater() {
    return {
      "text": i18n.__("arrivalLater"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": `${i18n.__("visit")}`,
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": `${i18n.__("eat")}`,
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": `${i18n.__("drink")}`,
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": `${i18n.__("walkAround")}`,
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": `${i18n.__("chat")}`,
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get isHereNow() {
    return {
      "text": i18n.__("isHereNow")
    }
  }

  get noPropgramForThisStaying() {
    return {
      "text": i18n.__("noPropgramForThisStaying"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get experienceMessage() {
    return {
      "text": i18n.__("experienceMessage")
    }
  }

  get excitementMessage() {
    return {
      "text": i18n.__("excitementMessage"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("excitementRep1"),
          "payload": "EXCITEMENT_CONFIRM",
        },
        {
          "content_type": "text",
          "title": i18n.__("excitementRep2"),
          "payload": "EXCITEMENT_CANCEL",
        }
      ]
    }
  }

  get defaultPostback() {
    return {
      "text": i18n.__("defaultPostback")
    }
  }

  get letsGoMessage() {
    return {
      "text": i18n.__("letsGoMessage")
    }
  }

  get letsGoMessage2() {
    return {
      "text": i18n.__("letsGoMessage2")
    }
  }

  get noNeedMessage() {
    return {
      "text": i18n.__("noNeedMessage")
    }
  }

  get preFeedback() {
    return {
      "text": i18n.__("preFeedback")
    }
  }

  get feedbackInput() {
    return {
      "text": i18n.__("feedbackInput")
    }
  }

  get preQuestionMessage() {
    return {
      "text": i18n.__("preQuestionMessage"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("alone"),
          "payload": "TRAVELTYPE_ALONE",
        },
        {
          "content_type": "text",
          "title": i18n.__("partner"),
          "payload": "TRAVELTYPE_PARTNER",
        },
        {
          "content_type": "text",
          "title": i18n.__("friends"),
          "payload": "TRAVELTYPE_FRIENDS",
        },
        {
          "content_type": "text",
          "title": i18n.__("family"),
          "payload": "TRAVELTYPE_FAMILY",
        }
      ]
    }
  }

  get question1Message() {
    return {
      "text": i18n.__("question1Message"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  backQuestion(EVENT) {
    return {
      "text": i18n.__("backQuestion"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("changeCategory"),
          "payload": `CATEGORY_${EVENT}`,
        },
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get question1MessageAfterLocation() {
    return {
      "text": i18n.__("question1MessageAfterLocation"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get question1MessageAfterGeoLocation() {
    return {
      "text": i18n.__("question1MessageAfterGeoLocation"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get question1MessageAfterLater() {
    return {
      "text": i18n.__("question1MessageAfterLater"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get question1MessageAfterDistrict() {
    return {
      "text": i18n.__("question1MessageAfterDistrict"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("changeDistrict"),
          "payload": "SEARCH_DISTRICT1",
        },
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get question1MessageListView() {
    return {
      "text": i18n.__("question1MessageAfterDistrict"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get nothingMore() {
    return {
      "text": i18n.__("nothingMore"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  rememberLocation(eventID, kindEvent) {
    return {
      "text": i18n.__("rememberLocation"),
      "quick_replies": [
        {
          "content_type": "location",
        },
        {
          "content_type": "text",
          "title": i18n.__("rememberLocationNo"),
          "payload": `USEOLDLOCATIONEVENT_${kindEvent}:${eventID}`,
        }
      ]
    }
  }

  updateLocation() {
    return {
      "text": i18n.__("updateLocation"),
      "quick_replies": [
        {
          "content_type": "location",
        },
        {
          "content_type": "text",
          "title": "👎",
          "payload": `NOUPDATELOCATION`,
        }
      ]
    }
  }

  askLocation(nameUser, eventID, kindEvent) {
    return {
      "text": i18n.__("askLocation"),
      "quick_replies": [
        {
          "content_type": "location",
          "title": "👍",
          "payload": `YESLOCATIONEVENT:${eventID}`,
        },
        {
          "content_type": "text",
          "title": "👎",
          "payload": `NOLOCATIONEVENT_${kindEvent}:${eventID}`,
        }
      ]
    }
  }

  sendItinerary(origin, destination) {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": i18n.__("sendItinerary"),
          "buttons": [
            {
              "type": "web_url",
              "url": `https://www.google.com/maps/dir/${origin.lat},${origin.lng}/${destination.lat},${destination.lng}/`,
              "title": i18n.__("itinerary2"),
              "webview_height_ratio": "full",
              "messenger_extensions": "false",
            }
          ]
        }
      }
    }
  }

  sendLocation(destination, eventName) {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": i18n.__("sendLocation"),
          "buttons": [
            {
              "type": "web_url",
              "url": `https://www.google.com/maps/dir//${destination.lat},${destination.lng}/`,
              "title": `📍 ${eventName}`,
              "webview_height_ratio": "full",
              "messenger_extensions": "false",
            }
          ]
        }
      }
    }
  }

  noLocationEvent(eventName) {
    return {
      "text": `${i18n.__("noLocationEvent")} ${eventName}${i18n.__("noLocationEvent2")}`
    }
  }

  noLocationEvent2(eventAddress) {
    return {
      "text": `📍 ${eventAddress}`
    }
  }

  get  selectionSite() {
    return {
      "text": i18n.__("selectionSite"),
    }
  }

  get saveLater() {
    return {
      "text": i18n.__("saveLater"),
    }
  }

  get selectionSite2() {
    return {
      "text": i18n.__("selectionSite2")
    }
  }

  selectionSiteType(city) {
    const elementCategoryVisit = indexCategoryVisit(city, i18n);
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": elementCategoryVisit
        }
      }
    }
  }

  get selectionBar() {
    return {
      "text": i18n.__("selectionBar"),
    }
  }

  get selectionBar2() {
    return {
      "text": i18n.__("selectionBar2")
    }
  }

  get selectionBarType() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": i18n.__("trendy"),
              "image_url": "https://api.marco-app.com/api/image/minTrendy.jpg",
              "subtitle": i18n.__("trendySub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("trendy"),
                  "payload": "BAR_TRENDY"
                }
              ]
            },
            {
              "title": i18n.__("atypical"),
              "image_url": "https://api.marco-app.com/api/image/minAtypicalBar.jpg",
              "subtitle": i18n.__("atypicalSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("atypical"),
                  "payload": "BAR_ATYPICAL"
                }
              ]
            },
            {
              "title": i18n.__("highClass"),
              "image_url": "https://api.marco-app.com/api/image/minHighClass.jpg",
              "subtitle": i18n.__("highClassSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("highClass"),
                  "payload": "BAR_HIGHCLASS"
                }
              ]
            },
            {
              "title": i18n.__("pubs"),
              "image_url": "https://api.marco-app.com/api/image/minPub.jpg",
              "subtitle": i18n.__("pubsSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("pubs"),
                  "payload": "BAR_PUB"
                }
              ]
            },
            {
              "title": i18n.__("cafe"),
              "image_url": "https://api.marco-app.com/api/image/minCafe.jpg",
              "subtitle": i18n.__("cafeSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("cafe"),
                  "payload": "BAR_CAFE"
                }
              ]
            },
            {
              "title": i18n.__("wine"),
              "image_url": "https://api.marco-app.com/api/image/minWineBar.jpg",
              "subtitle": i18n.__("wineSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("wine"),
                  "payload": "BAR_WINE"
                }
              ]
            },

          ]
        }
      }
    }
  }

  get selectionRestaurant() {
    return {
      "text": i18n.__("selectionRestaurant"),
    }
  }

  get selectionRestaurant2() {
    return {
      "text": i18n.__("selectionRestaurant2"),
    }
  }

  get selectionRestaurantType() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": i18n.__("gastronomic"),
              "image_url": "https://api.marco-app.com/api/image/minGastronomy.jpg",
              "subtitle": i18n.__("gastronomicSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("gastronomic"),
                  "payload": "RESTAURANT_GASTRONOMY"
                }
              ]
            },
            {
              "title": i18n.__("healthy"),
              "image_url": "https://api.marco-app.com/api/image/minVeggie.jpg",
              "subtitle": i18n.__("healthySub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("healthy"),
                  "payload": "RESTAURANT_VEGGIE"
                }
              ]
            },
            {
              "title": i18n.__("brunch"),
              "image_url": "https://api.marco-app.com/api/image/minBrunch.jpg",
              "subtitle": i18n.__("brunchSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("brunch"),
                  "payload": "RESTAURANT_BRUNCH"
                }
              ]
            },
            {
              "title": i18n.__("street"),
              "image_url": "https://api.marco-app.com/api/image/minStreetfood.jpg",
              "subtitle": i18n.__("streetSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("street"),
                  "payload": "RESTAURANT_STREET"
                }
              ]
            },
            {
              "title": i18n.__("traditional"),
              "image_url": "https://api.marco-app.com/api/image/minTraditional.jpg",
              "subtitle": i18n.__("traditionalSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("traditional"),
                  "payload": "RESTAURANT_TRADITIONAL"
                }
              ]
            },
            {
              "title": i18n.__("other"),
              "image_url": "https://api.marco-app.com/api/image/minRestaurant.jpg",
              "subtitle": i18n.__("otherSub"),
              "buttons": [
                {
                  "type": "postback",
                  "title": i18n.__("other"),
                  "payload": "RESTAURANT_OTHER"
                }
              ]
            },

          ]
        }
      }
    }
  }

  get selectionDistrict() {
    return {
      "text": i18n.__("selectionDistrict"),
    }
  }

  get selectionDistrict2() {
    return {
      "text": i18n.__("selectionDistrict2")
    }
  }

  selectionDistrictType(city, page) {
    const elementsDistrict = indexElementDistrict(city, parseInt(page), i18n);
    const buttonsDistrict =
      limitPageDistrict(city) <= page ? null :
        [{
          "title": i18n.__("selectionDistrictType"),
          "type": "postback",
          "payload": `SEARCH_DISTRICTAT${parseInt(page) + 1}`
        }];
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "list",
          "top_element_style": "compact",
          "elements": elementsDistrict,
          "buttons": buttonsDistrict
        }
      }
    }
  }


  get nothingInThisDistrict() {
    return {
      "text": i18n.__("nothingInThisDistrict"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("changeDistrict"),
          "payload": `SEARCH_OTHERDISTRICT`,
        },
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get findNothing() {
    return {
      "text": i18n.__("findNothing"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  viewMore(description, kindElement, eventID) {
    return {
      "text": `${description}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("viewMore1"),
          "payload": `GOING_${kindElement}:${eventID}`,
        },
        {
          "content_type": "text",
          "title": i18n.__("viewMore2"),
          "payload": `LATER_${kindElement}:${eventID}`,
        },
      ]
    }
  }

  priceMessage(type, tag) {
    return {
      "text": type === 'RESTAURANT' ?
        i18n.__("priceMessage1") :
        i18n.__("priceMessage2"),
      "quick_replies": [
        {
          "content_type": "text",
          "title": "💰",
          "payload": `PRICE${type}_${tag}_ONE`,
        },
        {
          "content_type": "text",
          "title": "💰💰",
          "payload": `PRICE${type}_${tag}_TWO-THREE`,
        },
        // {
        //   "content_type": "text",
        //   "title": "💸💸💸",
        //   "payload": `PRICE${type}_${tag}_`,
        // },
        {
          "content_type": "text",
          "title": "💰💰💰",
          "payload": `PRICE${type}_${tag}_FOUR`,
        }
      ]
    }
  }

  get fetchRestaurantsMessage() {
    return {
      "text": i18n.__("fetchRestaurantMessage")
    }
  }

  get fetchVisitsMessage() {
    return {
      "text": i18n.__("fetchVisitMessage")
    }
  }

  get fetchBarsMessage() {
    return {
      "text": i18n.__("fetchBarsMessage")
    }
  }

  jokeMarco(EVENT, city) {
    const arrayAnecdotes = anecdotes(city, this.locale);
    const indexJoke = Math.floor(Math.random() *
      Math.floor(arrayAnecdotes.length - 1));
    return {
      "text": `${i18n.__("jokeMarco1")}\n${i18n.__("jokeMarco2")}\n${arrayAnecdotes[indexJoke]}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("changeDistrict"),
          "payload": `CATEGORY_${EVENT}`,
        },
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  jokeMarco2(city) {
    const arrayAnecdotes = anecdotes(city, this.locale);
    const indexJoke = Math.floor(Math.random() *
      Math.floor(arrayAnecdotes.length - 1));
    return {
      "text": `${i18n.__("jokeMarco1")}\n${i18n.__("jokeMarco2")}\n${arrayAnecdotes[indexJoke]}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get helpMessage() {
    return {
      "text": `${i18n.__("helpMessage1")}\n${i18n.__("helpMessage2")}\n\n${i18n.__("helpMessage3")}`
    }
  }

  get unsubscribeMessage() {
    return {
      "text": `${i18n.__("unsubscribeMessage1")}\n\n\n${i18n.__("unsubscribeMessage2")}`
    }
  }

  get subscribeMessage() {
    return {
      "text": i18n.__("subscribeMessage")
    }
  }

  get unsubscribeMessageError() {
    return {
      "text": i18n.__("unsubscribeMessageError")
    }
  }

  get startTalkingWithHuman() {
    return {
      "text": `${i18n.__("startTalkingWithHuman")}\n${i18n.__("startTalkingWithHuman2")}\n${i18n.__("startTalkingWithHuman3")}`,
    }
  }

  get startTalkingWithHuman2() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": `${i18n.__("startTalkingWithHuman")}`,
              "subtitle": i18n.__("startTalkingWithHuman2Bis"),
              "buttons": [
                {
                  "type": "postback",
                  "title": "Stop chat",
                  "payload": "STOPTALKING_"
                },
              ]
            }
          ]
        }
      }
    }
  }

  get startTalkingWithHumanHelp() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": `${i18n.__("startTalkingWithHumanHelp")}`,
              "subtitle": i18n.__("startTalkingWithHumanHelp2"),
              "buttons": [
                {
                  "type": "postback",
                  "title": "Stop chat",
                  "payload": "STOPTALKING_"
                },
              ]
            }
          ]
        }
      }
    }
  }

  get selectionDistrictChoice() {
    return {
      "text": i18n.__("selectionDistrictChoice")
    }
  }

  get aroundMeChoice() {
    return {
      "text": i18n.__("aroundMeChoice")
    }
  }

  stopTalkingWithHuman(name) {
    return {
      "text": `Hey ${name}${i18n.__("stopTalkingWithHuman")}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get shareMessage() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": "Marco",
              "image_url": `https://api.marco-app.com/api/image/marcoSharePhoto.jpg`,
              "subtitle": i18n.__("shareSubtitle"),
              "buttons": [
                {
                  "type": "element_share",
                  "share_contents": {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": [
                          {
                            "title": "Marco",
                            "image_url": `https://api.marco-app.com/api/image/marcoSharePhoto.jpg`,
                            "subtitle": i18n.__("shareSubtitle"),
                            "buttons": [{
                              "type": "web_url",
                              "url": "https://m.me/meethellomarco?ref=share",
                              "title": i18n.__("shareButton")
                            }
                            ]
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }

  messageOfItineraryNotification(name, city, numberDay, programs_id) {
    const dayString = this.locale === 'fr' ? numberDayStringFR[numberDay] : numberDayString[numberDay];
    const cityToLowerCase = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToLowerCase.toLowerCase();
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": `Hey ${name} 😊,${i18n.__("messageOfItineraryNotification")}${dayString}${i18n.__("messageOfItineraryNotification2")}${i18n.__(lowerCity)}`,
          "buttons": [
            {
              "type": "postback",
              "title": "Start ⚡️",
              "payload": `STARTITINERARY_${programs_id}:${parseInt(numberDay)}`
            }
          ]
        }
      }
    }
  }

  messageOfItineraryNotification2(city, numberDay, programs_id) {
    const dayString = this.locale === 'fr' ? numberDayStringFR[numberDay] : numberDayString[numberDay];
    const cityToLowerCase = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToLowerCase.toLowerCase();
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": `${i18n.__("messageNotification")}${dayString}${i18n.__("messageOfItineraryNotification2")}${i18n.__(lowerCity)}`,
          "buttons": [
            {
              "type": "postback",
              "title": "Start ⚡️",
              "payload": `STARTITINERARY_${programs_id}:${parseInt(numberDay)}`
            }
          ]
        }
      }
    }
  }

  // itineraryNotifications(description, numberDay, page, programs_id) {
  //   return {
  //     "attachment": {
  //       "type": "template",
  //       "payload": {
  //         "template_type": "button",
  //         "text": `${description}`,
  //         "buttons": [
  //           {
  //             "type": "postback",
  //             "title": "Next !",
  //             "payload": `ITINERARYNEXT_${programs_id}:${parseInt(
  //               numberDay)}:${parseInt(page) + 1}`
  //           }
  //         ]
  //       }
  //     }
  //   }
  // }

  itineraryNotifications(description, numberDay, page, programs_id, locationsGoogleMap) {
    return {
      "text": `${description}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("next"),
          "payload": `ITINERARYNEXT_${programs_id}:${parseInt(
            numberDay)}:${parseInt(page) + 1}`,
        },
        {
          "content_type": "text",
          "payload": `SEEITINERARYONMAP_${locationsGoogleMap}:${programs_id}:${parseInt(
            numberDay)}:${parseInt(page)}`,
          "title": i18n.__("stepMap")
        },
        {
          "content_type": "text",
          "payload": `SEEMENU_`,
          "title": `📃 Menu`
        }
      ]
    }
  }

  sendPhotoItinerary(photo) {
    return {
      "attachment": {
        "type": "image",
        "payload": {
          "url": `https://api.marco-app.com/api/image/${photo}`,
          "is_reusable": true,
        }
      }
    }
  }

  clickOnItinerary(locationsGoogleMap) {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": i18n.__("sendLocation"),
          "buttons": [
            {
              "type": "web_url",
              "url": `https://www.google.com/maps/${locationsGoogleMap}`,
              "title": i18n.__("clickHere"),
              "webview_height_ratio": "full",
              "messenger_extensions": "false",
            }
          ]
        }
      }
    }
  }

  menuOrNextItinerary(idProgram, numberDay, page) {
    return {
      "text": i18n.__('question1MessageAfterGeoLocation'),
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("next"),
          "payload": `ITINERARYNEXT_${idProgram}:${parseInt(
            numberDay)}:${parseInt(page) + 1}`,
        },
        {
          "content_type": "text",
          "payload": `SEEMENU_`,
          "title": `📃 Menu`
        }
      ]
    }
  }

  messageForTomorrow(name, city) {
    const cityToLowerCase = city[0].toUpperCase() + city.slice(1);
    const lowerCity = cityToLowerCase.toLowerCase();
    return {
      "text": `Hey ${name}${i18n.__("messageForTomorrow")}${cityToLowerCase} ${i18n.__("messageForTomorrow2")}\n${i18n.__("messageForTomorrow3")}${i18n.__(lowerCity)}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  textBeforeShare(url) {
    return {
      "text": `${i18n.__("textBeforeShare")}${url}\n\n${i18n.__("textBeforeShare3")}`,
    }
  }

  get shareOrFindUrlMedium() {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "generic",
          "elements": [
            {
              "title": i18n.__("shareUrlTitle"),
              "subtitle": i18n.__("helpMessage2"),
              "image_url": "https://api.marco-app.com/api/image/marcoSharePhoto.jpg",
              "buttons": [
                {
                  "type": "element_share",
                  "share_contents": {
                    "attachment": {
                      "type": "template",
                      "payload": {
                        "template_type": "generic",
                        "elements": [
                          {
                            "title": `Share`,
                            "subtitle": i18n.__("helpMessage2"),
                            "image_url": `https://api.marco-app.com/api/image/marcoSharePhoto.jpg`,
                            "default_action": {
                              "type": "web_url",
                              "url": "https://www.messenger.com/t/meethellomarco?ref=share",

                            },
                            "buttons": [
                              {
                                "type": "web_url",
                                "url": `https://www.messenger.com/t/marco.bot.paris`,
                                "title": i18n.__("shareUrlButton")
                              },
                            ]
                          }
                        ]
                      }
                    }
                  }
                }
              ]
            }
          ]
        }
      }
    }
  }

  get tomorrowImHere() {
    return {
      "text": `${i18n.__("comeBackTomorrow")}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get seeMenuTransition() {
    return {
      "text": `${i18n.__("seeMenu")}`,
      "quick_replies": [
        {
          "content_type": "text",
          "title": i18n.__("geolocation"),
          "payload": "SEARCH_GEOLOCATION",
        },
        {
          "content_type": "text",
          "title": i18n.__('ticketing'),
          "payload": "SEARCH_TICKETING"
        },
        {
          "content_type": "text",
          "title": i18n.__("visit"),
          "payload": "SEARCH_VISIT",
        },
        {
          "content_type": "text",
          "title": i18n.__("eat"),
          "payload": "SEARCH_RESTAURANT",
        },
        {
          "content_type": "text",
          "title": i18n.__("drink"),
          "payload": "SEARCH_BAR",
        },
        {
          "content_type": "text",
          "title": i18n.__("walkAround"),
          "payload": "SEARCH_DISTRICT",
        },
        {
          "content_type": "text",
          "title": i18n.__("chat"),
          "payload": "SEARCH_HUMAN",
        }
      ]
    }
  }

  get preGeolocation() {
    return {
      "text": i18n.__("preGeolocation"),
      "quick_replies": [
        {
          "title": "test title",
          "content_type": "location",
          "payload": "ZER"
        }
      ]
    }
  }

  noAroundMe(city) {
    return {
      "attachment": {
        "type": "template",
        "payload": {
          "template_type": "button",
          "text": `${i18n.__("noAroundMe")}${i18n.__(city)}${i18n.__("noAroundMe2")}`,
          "buttons": [
            {
              "type": "postback",
              "title": i18n.__("switchCity"),
              "payload": "CHANGEMYCITY"
            }
          ]
        }
      }
    }
  }

  ticketingModel(listTicketing, page) {
    return new Promise((resolve, reject) => {
      let arrayElement = [];
      async.each(listTicketing, (affiliation, callback) => {
        const kindElement = Object.keys(affiliation).find(elem =>
        elem.includes('s_id') && affiliation[elem] !== null);
        let globalUrl = affiliation.url;
        globalUrl.includes('https://') ? null : globalUrl = `https://${globalUrl}`;
        const element = {
          "title": `${affiliation.name}`,
          "image_url": `https://api.marco-app.com/api/image/${affiliation[kindElement].photos[0]}`,
          "subtitle": `📍 ${affiliation[kindElement].location.name} \n${affiliation.price} €`,
          "default_action": {
            "type": "web_url",
            "url": `${affiliation.url}`,
          },
          "buttons": [
            {
              "type": "element_share",
              "share_contents": {
                "attachment": {
                  "type": "template",
                  "payload": {
                    "template_type": "generic",
                    "elements": [
                      {
                        "title": `${affiliation.name}`,
                        "subtitle": `📍 ${affiliation[kindElement].location.name} \n${affiliation.price} €`,
                        "image_url": `https://api.marco-app.com/api/image/${affiliation[kindElement].photos[0]}`,
                        "default_action": {
                          "type": "web_url",
                          "url": "https://www.messenger.com/t/meethellomarco?ref=share_card",

                        },
                        "buttons": [
                          {
                            "type": "web_url",
                            "url": `${globalUrl}`,
                            "title": i18n.__("buyShare")
                          },
                        ]
                      }
                    ]
                  }
                }
              }
            },
            {
              "type": "web_url",
              "url": `${globalUrl}`,
              "title": i18n.__("buyShare")
            },
          ]
        };
        arrayElement.push(element);
        callback()
      }, (err) => {
        if (err) return reject(err);
        if (arrayElement.length === 5) {
          const morePage = {
            "title": i18n.__("seeMore"),
            "subtitle": i18n.__("seeMoreSub"),
            "image_url": `https://api.marco-app.com/api/image/FBProfileRe.png`,
            "buttons": [
              {
                "type": "postback",
                "title": i18n.__("seeMoreButton"),
                "payload": `NEXTPAGEEVENT_TICKETING:${parseInt(page) + 1}`
              },
            ]
          };
          arrayElement.push(morePage)
        }
        return resolve({
          "attachment": {
            "type": "template",
            "payload": {
              "template_type": "generic",
              "elements": arrayElement
            }
          }
        });
      })
    })
  }

}

module.exports = MessageData;
