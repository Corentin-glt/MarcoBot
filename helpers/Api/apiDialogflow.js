const dialogflow = require("dialogflow");
const config = require("../../config.js");
const sessionClient = new dialogflow.SessionsClient({
  credentials: {
    private_key: config.privateKeyDialogflow,
    client_email: config.clientEmailDialogflow
  }
});


class apiDialogFlow {
  constructor(language) {
    this.language = language;
    this.projectId = config.projectIDDialogflow;
    this.clientEmail = config.clientEmailDialogflow;
    this.privateKey = config.privateKeyDialogflow;
    this.sessionId = config.sessionsIDDialogflow;
    this.config = {
      credentials: {
        private_key: this.privateKey,
        client_email: this.clientEmail
      }
    };
    // this.sessionClient = new dialogflow.SessionsClient(this.config);
  }

  sendTextMessageToDialogFlow(textMessage) {
    return new Promise((resolve, reject) => {
      const sessionPath = this.sessionClient.sessionPath(
        this.projectId,
        this.sessionId
      );
      const request = {
        session: sessionPath,
        queryInput: {
          text: {
            text: textMessage,
            languageCode: this.language
          }
        }
      };
      this.sessionClient
        .detectIntent(request)
        .then(responses => resolve(responses[0].queryResult))
        .catch(err => reject(err));
    });
  }
}

module.exports = apiDialogFlow;
