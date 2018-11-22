const contextsCanNext = require('./contextsCanNext');
const async = require('async')
const ApiGraphql = require("../../../helpers/Api/apiGraphql");
const Message = require("../../../view/messenger/Message");
const Sentry = require("@sentry/node");
const config = require("../../../config");
const contextQuery = require("../../../helpers/graphql/context/query");
const contextMutation = require("../../../helpers/graphql/context/mutation");
const Process = require("../../Process");

class Next {
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
        this.updateContext(context)
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
          //TODO get context with page !
            .sendQuery(
              contextQuery.getUserContextByPage(this.event.senderId, page))
            .then(res => {
              page++;
              const contextArray = res.contextsByUserAndPage;
              const contextNext = contextsCanNext.find(item => {
                return item === contextArray[0].name;
              });
              if (typeof contextNext !== 'undefined') {
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
          return resolve(context)
        }
      )
    })
  }

  updateContext(context){
    console.log('CONTEXT BEFORE => ',context);
    const filter = {
      contextId: context.id,
      page: parseInt(context.page) + 1,
    };
    this.apiGraphql
      .sendMutation(contextMutation.updateContextByPage(), filter)
      .then(res => {
        console.log('CONTEXT AFTER ==> ', res.updateContextByPage)
        console.log('==> ', Process)
        const newProcess = new Process(this.event);
        console.log('PROCESS', newProcess)
        newProcess.getStartWithContext(res.updateContextByPage)
      })
      .catch(err => {
        Sentry.captureException(err);
      });
  }
}

module.exports = Next;