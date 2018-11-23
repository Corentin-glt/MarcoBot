const async = require('async');
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const config = require("../../../config");
const contextQuery = require("../../../helpers/graphql/context/query");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const ViewDefault = require("../../../view/default/ViewDefault");
const ViewChatAction = require('../../../view/chatActions/ViewChatAction');



class Unknown {
  constructor(event, context, user) {
    this.event = event;
    this.context = context;
    this.user = user;
    this.apiGraphql = new ApiGraphql(
      config.category[config.indexCategory].apiGraphQlUrl,
      config.accessTokenMarcoApi
    );
  }

  start() {
    this.findContext()
      .then(context => {
        console.log(context);
        const defaultMessage = new ViewDefault(this.user, this.event.locale);
        const messageArray = [ViewChatAction.markSeen(),
          ViewChatAction.typingOn(), ViewChatAction.typingOff(), defaultMessage.menuDefault()];
        new Message(this.event.senderId, messageArray).sendMessage();

      })
      .catch(err => Sentry.captureException(err))
  }

  findContext() {
    let page = 0;
    let contextFound = false;
    return new Promise((resolve, reject) => {
      async.whilst(
        () => contextFound === false,
        (callback) => {
          this.apiGraphql
            .sendQuery(
              contextQuery.getUserContextByPage(this.event.senderId, page))
            .then(res => {
              console.log('CONTEXT NUMERO: ', page);
              page++;
              const contextArray = res.contextsByUserAndPage;
              console.log('CONTEXT NAME: ', contextArray[0].name);
              if (contextArray[0].name !== 'unknown' && contextArray[0].name !== 'next') {
                contextFound = true;
                callback(null, contextArray[0]);
              } else {
                callback(null, contextArray[0]);
              }
            })
            .catch(err => callback(err))
        },
        (err, context) => {
          if (err) return reject(err);
          if (contextFound) {
            console.log(' !!!! FINISH !!!\n CONTEXT GOOD ==> ', context.name);
            return resolve(context)
          }
        }
      )
    })
  }

}

module.exports = Unknown;