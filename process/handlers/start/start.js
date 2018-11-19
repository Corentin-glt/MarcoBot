const Message = require('../../../view/messenger/Message');
const Text = require('../../../view/messenger/Text');
const Pause = require('../../../view/messenger/Pause');
const ChatAction = require('../../../view/messenger/ChatAction');
const i18n = require('i18n');

i18n.configure({
  locales: ['en', 'fr'],
  directory: __dirname + '/../../../locales',
  defaultLocale: 'en',
  cookie: 'lang',
  register: global
});


module.exports = (event, context, user) => {
  i18n.setLocale(event.locale);
  if (context.values.length === 0) {
    console.log('in right process context');
    const messagePresentation = new Text(
      i18n.__('initialMessage') + `${user.firstName} ! 👋 \n` +
      i18n.__('initialMessageBis'))
      .get();
    const chatActionSeen = new ChatAction('mark_seen').get();
    const chatActionTyping = new ChatAction('typing_on').get();
    const pause1 = new Pause(4000).get();
    const pause2 = new Pause(2000).get();
    const chatActionNoTyping = new ChatAction('typing_off').get();
    const messagePresentation2 = new Text(
      i18n.__('initialMessage2')
    ).get();
    const messagePresentation3 = new Text(
      i18n.__('initialMessage3')
    ).get();
    const messageArray = [chatActionSeen, chatActionTyping, chatActionNoTyping,
      messagePresentation, chatActionTyping, pause1, chatActionNoTyping,
      messagePresentation2, chatActionTyping, pause2, chatActionNoTyping,
      messagePresentation3];
    console.log(messageArray);
    const newMessage = new Message(event.senderId, messageArray);
    newMessage.sendMessage();
  } else {
    if (context.values[0].value) {

    } else {


    }
  }
};