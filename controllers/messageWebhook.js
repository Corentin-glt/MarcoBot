/**
 * Created by corentin on 27/04/2018.
 */
const processMessage = require('./nlp/nlp');

const axios = require('axios');
const ApiGraphql = require('../helpers/Api/apiGraphql');
const ApiReferral = require('../helpers/Api/apiReferral');
const messengerMethods = require('../messenger/messengerMethods');
const user = require("../graphql/user/query");
const accountMessenger = require('../graphql/accountMessenger/query');
const config = require('../config');
const Sentry = require('@sentry/node');
const checkEvents = require('./events/events');
const checkNlp = require('./nlp/nlp');

const _checkReferral = (event) => {
  if(event.referral || (typeof event.postback !== "undefined" &&event.postback.referral)) {
    event.referral = event.referral || event.postback.referral;
    const nameReferral = event.referral.source === "DISCOVER_TAB" ? 'Discovery' : event.referral.ref;
    ApiReferral.sendReferral(nameReferral, event.sender.id);
  }
};

const _handling = (event, user) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const senderId = event.sender.id;
  const queryAccount = accountMessenger.queryPSID(senderId);
  apiGraphql.sendQuery(queryAccount)
    .then(response => {
      event.locale = response.accountMessenger.locale.split("_")[0];
      _checkReferral(event);
      if ((event.message && event.message.text && event.message.quick_reply)
        || (event.message && event.message.attachements)
        || (event.postback)
      ) {
        checkEvents(event)
      } else {
        checkNlp(event)
      }
    })
    .catch(err => {
      Sentry.captureException(err)
    });
};

module.exports = (req, res) => {
  if (req.body.object === "page") {
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        const senderId = event.sender.id;
        const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
        const query = user.queryUserByAccountMessenger(senderId);
        apiGraphql.sendQuery(query)
          .then(res => {
            if (res.userByAccountMessenger === null) {
              messengerMethods.createUser(senderId)
                .then(res => {
                  const user = res.createUser;
                  _handling(event, user);
                })
                .catch(err => Sentry.captureException(err));
            } else {
              const user = res.userByAccountMessenger;
              _handling(event, user);
            }
          })
          .catch(err => {
            Sentry.captureException(err)
          })
      });
    });
    res.status(200).end();
  }
};
