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
const Init = require('./init');

// const _checkReferral = (event) => {
//   if(event.referral || (typeof event.postback !== "undefined" &&event.postback.referral)) {
//     event.referral = event.referral || event.postback.referral;
//     const nameReferral = event.referral.source === "DISCOVER_TAB" ? 'Discovery' : event.referral.ref;
//     ApiReferral.sendReferral(nameReferral, event.sender.id);
//   }
// };


module.exports = (req, res) => {
  if (req.body.object === "page") {
    const init = new Init(req.body.entry);
    init.handleEntry();
    res.status(200).end();
  }
};
