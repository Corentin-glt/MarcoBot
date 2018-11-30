module.exports = {
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
              "payload": "changeCity"
            },
            {
              "title": "🗺 New trip",
              "type": "postback",
              "payload": "trip"
            },
            {
              "title": "🧡 My favorites",
              "type": "postback",
              "payload": "favorite"
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
              "payload": "help"
            },
            {
              "title": "Subscription",
              "type": "postback",
              "payload": "subscribe"
            },
            {
              "title": "Restart",
              "type": "postback",
              "payload": "start"
            }
          ]
        },
        {
          "title": "💌 Invite a friend",
          "type": "postback",
          "payload": "share"
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
              "payload": "changeCity"
            },
            {
              "title": "🗺 New trip",
              "type": "postback",
              "payload": "trip"
            },
            {
              "title": "🧡 My favorites",
              "type": "postback",
              "payload": "favorite"
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
              "payload": "help"
            },
            {
              "title": "Subscription",
              "type": "postback",
              "payload": "subscribe"
            },
            {
              "title": "Restart",
              "type": "postback",
              "payload": "start"
            }
          ]
        },
        {
          "title": "💌 Invite a friend",
          "type": "postback",
          "payload": "share"
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
              "payload": "changeCity"
            },
            {
              "title": "🗺 Nouveau voyage",
              "type": "postback",
              "payload": "trip"
            },
            {
              "title": "🧡 Mes favoris",
              "type": "postback",
              "payload": "favorite"
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
              "payload": "help"
            },
            {
              "title": "Notifications",
              "type": "postback",
              "payload": "subscribe"
            },
            {
              "title": "Recommencer",
              "type": "postback",
              "payload": "start"
            }
          ]
        },
        {
          "title": "💌 Inviter un ami",
          "type": "postback",
          "payload": "share"
        },
      ]
    }
  ]
};