/**
 * Created by corentin on 27/04/2018.
 */
const processMessage = require('../helpers/processMessage');
const receivedPostback = require('../helpers/receivedPostback');
const receivedQuickReply = require('../helpers/receivedQuickReply');
const receiveLocationItinerary = require('../helpers/receiveLocationItinerary');
const receiveLocationAroundMe = require('../helpers/receiveLocationAroundMe');
const receiveDateArrival = require('../helpers/receiveDateArrival');
const receiveDurationTravel = require('../helpers/receiveDurationTravel');
const axios = require('axios');
const ApiGraphql = require('../helpers/apiGraphql');
const messengerMethods = require('../messenger/messengerMethods');
const user = require("../graphql/user/query");
const accountMessenger = require('../graphql/accountMessenger/query');
const config = require('../config');


const _handlingEvent = (event, user) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const senderId = event.sender.id;
  const queryAccount = accountMessenger.queryPSID(senderId);
  console.log(event);
apiGraphql.sendQuery(queryAccount)
    .then(response => {
      event.locale = response.accountMessenger.locale.split("_")[0];
      if (event.message && event.message.text) {
        console.log(event.message);
        if(event.message.quick_reply) {
          receivedQuickReply(event);
        } else if (event.message.nlp.entities.datetime && event.message.nlp.entities.datetime[0].confidence > 0.8) {
          receiveDateArrival(event);
        } else if(event.message.nlp.entities.duration && event.message.nlp.entities.duration[0].normalized.value && event.message.nlp.entities.duration[0].confidence > 0.8){
          receiveDurationTravel(event);
        } else {
          processMessage(event);
        }
      } else if (event.referral) {
        axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
          event: 'CUSTOM_APP_EVENTS',
          custom_events: JSON.stringify([
            {
              _eventName: event.referral.source === "DISCOVER_TAB" ? 'Discovery' : event.referral.ref,
            }
          ]),
          advertiser_tracking_enabled: 1,
          application_tracking_enabled: 1,
          extinfo: JSON.stringify(['mb1']),
          page_id: event.recipient.id,
          page_scoped_user_id: event.sender.id
        })
          .then(response => {
            console.log(response.data);
          })
          .catch(err => {
            console.log(err);
            console.log(err.response.data.error);
          })
      } else {
        if (event.postback) {
          if (event.postback.referral) {
            axios.post('https://graph.facebook.com/' + config.category[config.indexCategory].appId + '/activities', {
              event: 'CUSTOM_APP_EVENTS',
              custom_events: JSON.stringify([
                {
                  _eventName: event.postback.referral.source === "DISCOVER_TAB" ? 'Discovery' : event.postback.referral.ref,
                }
              ]),
              advertiser_tracking_enabled: 1,
              application_tracking_enabled: 1,
              extinfo: JSON.stringify(['mb1']),
              page_id: event.recipient.id,
              page_scoped_user_id: event.sender.id
            })
              .then(response => {
                console.log(response.data);
              })
          }
          receivedPostback(event);
        } else if (event.message.attachments && event.message.attachments[0].type === 'location') {
          switch(user.geoLocation.lastEvent) {
            case "itinerary":
              receiveLocationItinerary(event);
              break;
            case "aroundMe":
              receiveLocationAroundMe(event);
              break;
            default:
              console.log("nothing found error");
          }

        }
      }
    })
    .catch(err => {
      console.log(err);
    });
};

module.exports = (req, res) =>  {
  if (req.body.object === "page"){
    req.body.entry.forEach(entry => {
      entry.messaging.forEach(event => {
        const senderId = event.sender.id;
        const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
        const query = user.queryUserByAccountMessenger(senderId);
        const queryAccount = accountMessenger.queryPSID(senderId);
        apiGraphql.sendQuery(query)
          .then(res => {
            if (res.userByAccountMessenger === null) {
              messengerMethods.createUser(senderId)
                .then(res => {
                  console.log(res);
                  const user = res.createUser;
                  _handlingEvent(event, user);
                })
                .catch(err => console.log("Error to create USER: ", err));
            } else {
              const user = res.userByAccountMessenger;
              _handlingEvent(event, user);
            }
          })
          .catch(err => {
            console.log(err);
          })
      });
    });
    res.status(200).end();
  }
};
