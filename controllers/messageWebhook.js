/**
 * Created by corentin on 27/04/2018.
 */
const processMessage = require('../helpers/processMessage');
const receivedPostback = require('../helpers/receivedPostback');
const receivedQuickReply = require('../helpers/receivedQuickReply');
const receiveLocation = require('../helpers/receiveLocation');
const receiveDateArrival = require('../helpers/receiveDateArrival');
const receiveDurationTravel = require('../helpers/receiveDurationTravel');
const axios = require('axios');
const ApiGraphql = require('../helpers/apiGraphql');
const messengerMethods = require('../messenger/messengerMethods');
const user = require("../graphql/user/query");
const accountMessenger = require('../graphql/accountMessenger/query');
const config = require('../config');

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
                .then((userSaved) => {
                  console.log(userSaved);
                    return apiGraphql.sendQuery(queryAccount)
                })
                .then(accountMessenger => {
                  console.log(accountMessenger);
                })
                .catch(err => console.log("Error to create USER: ", err));
            } else {
              apiGraphql.sendQuery(queryAccount)
                .then(response => {
                  event.locale = response.accountMessenger.locale.split("_")[0];
                  console.log(event.locale);
                  if (event.message && event.message.text) {
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
                    axios.post('https://graph.facebook.com/224098718181615/activities', {
                      event: 'CUSTOM_APP_EVENTS',
                      custom_events: JSON.stringify([
                        {
                          _eventName: event.referral.ref,
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
                        axios.post('https://graph.facebook.com/224098718181615/activities', {
                          event: 'CUSTOM_APP_EVENTS',
                          custom_events: JSON.stringify([
                            {
                              _eventName: event.postback.referral.ref,
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
                      receiveLocation(event);
                    }
                  }
                })
                .catch(err => {
                  console.log(err);
                });
            }
          });

      });
    });
    res.status(200).end();
  }
};