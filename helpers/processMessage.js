/**
 * Created by corentin on 30/04/2018.
 */
const Config = require('../config');
const apiAiClient = require("apiai")(Config.clientTokenDialogflow);
const queryUserMessenger = require('../graphql/userMessenger/query');
const graphqlRequest = require('../helpers/apiGraphql');
const apiMessenger = require('../helpers/apiMessenger');
const messengerMethods = require('../messenger/messengerMethods');
const clientControl = require('../controllers/clientControl');



module.exports = (event) => {
  const senderId = event.sender.id;
  const message = event.message.text;
  const query = queryUserMessenger.queryPSID(senderId);
  graphqlRequest.sendQuery(query)
    .then(res => {
      if (res.userMessenger === null) {
        messengerMethods.createUser(senderId)
          .then((userSaved) => {
            console.log('USER SAVED');
            console.log(userSaved);
            //DO SOME SHIT
          })
          .catch(err => console.log("Error to create USER: ", err))
      }
      const apiaiSession = apiAiClient.textRequest(message,
        {sessionId: Config.projectIDDialogflow});
      apiaiSession.on("response", (response) => {
        //TODO: FAIRE FONCTION QUI CHECK LA REPONSE DU DIALOGFLOW ET DONC DE LA DEMANDE DE L'UTILISATEUR
        console.log("RESPONSE ===> ", response.result);
        clientControl.checkDialogflow(senderId, response)
          .then(() => console.log("CHECKING DONE !"))
          .catch(err => console.log(err));
      });
      apiaiSession.on("error", error => console.log("ERROR dialogflow ===>", error));
      apiaiSession.end();
    })
    .catch(err => console.log(err));
};