/**
 * Created by corentin on 30/04/2018.
 */
const Config = require('../config');
const apiAiClient = require("apiai")(Config.clientTokenDialogflow);
const user = require("../graphql/user/query");
const userMutation = require("../graphql/user/mutation");
const ApiGraphql = require('../helpers/apiGraphql');
const apiMessenger = require('../helpers/apiMessenger');
const messengerMethods = require('../messenger/messengerMethods');
const clientControl = require('../controllers/clientControl');
const MessageData = require('../messenger/product_data');
const config = require("../config");
const stopTalking = require('../messenger/quickReplyBlocks/stopTalkingWithHuman')

const messageToStopTalkingWithHuman = [
  "start marco",
  "stop talking with human",
  "stop talking",
  "stop",
  "start bot",
  "start marcobot",
  "stop human",
  "i want marco",
  "i want marco back",
  "stop chat",
];

const sendMessage = (senderId, data, typeMessage) => {
  return new Promise((resolve, reject) => {
    const objectToSend = {
      recipient: {id: senderId},
      messaging_types: typeMessage,
      message: data
    };
    apiMessenger.sendToFacebook(objectToSend)
      .then((res) => resolve(res))
      .catch(err => reject(err));
  });
};

module.exports = (event) => {
  const apiGraphql = new ApiGraphql(config.category[config.indexCategory].apiGraphQlUrl, config.accessTokenMarcoApi);
  const locale = event.locale;
  const senderId = event.sender.id;
  const message = event.message.text;
  const query = user.queryUserByAccountMessenger(senderId);
  const product_data = new MessageData(locale);
  apiGraphql.sendQuery(query)
    .then(res => {
      if (res.userByAccountMessenger === null) {
        messengerMethods.createUser(senderId)
          .then((userSaved) => {

          })
          .catch(err => console.log("Error to create USER: ", err))
      }
      if(res.userByAccountMessenger !== null && res.userByAccountMessenger.isTalkingToHuman){
        if(messageToStopTalkingWithHuman.some(elem => elem.toUpperCase() === message.toUpperCase())) {
          return stopTalking(senderId, locale);
        } else {
          return apiGraphql.sendMutation(userMutation.updateUserByAccountMessenger(),
            {PSID: senderId, lastMessageToHuman: new Date()})
            .catch(err => console.log(err))
        }
      } else {
        apiAiClient.language = locale;
        const apiaiSession = apiAiClient.textRequest(message,
          {sessionId: Config.projectIDDialogflow, lang: locale});
          apiaiSession.on("response", (response) => {
            return clientControl.checkDialogflow(senderId, response, locale)
          });
          apiaiSession.on("error", error => {
            console.log("ERROR dialogflow ===>", error);
            return sendMessage(senderId, product_data.question1MessageListView, "RESPONSE")
          });
          apiaiSession.end();
      }
    })
    .catch(err => console.log(err));
};
