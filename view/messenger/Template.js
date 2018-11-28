const helper = require('../../helpers/helper');
const breakText = require('../../helpers/breakText');


class Template {
  constructor() {
    this.template = {};
    this.template.messaging_type = 'RESPONSE';
  }

  setNotificationType(type) {
    if (type !== 'REGULAR' && type !== 'SILENT_PUSH' && type !== 'NO_PUSH')
      throw new Error('Notification type must be one of REGULAR, SILENT_PUSH, or NO_PUSH');
    this.template.notification_type = type;
    return this;
  }

  setMessagingType(type) {
    if (type !== 'RESPONSE' && type !== 'UPDATE' && type !== 'MESSAGE_TAG') {
      type = 'RESPONSE';
    }
    this.template.messaging_type = type;
    return this;
  }

  setMessageTag(tag) {
    this.template.message_tag = tag;
    return this;
  }

  addQuickReply(text, payload, imageUrl) {
    if (!text || !payload)
      throw new Error('Both text and payload are required for a quick reply');

    if (payload.length > 1000)
      throw new Error('Payload can not be more than 1000 characters long');
    if (imageUrl && !helper.isUrl(imageUrl))
      throw new Error('Image has a bad url');

    if (!this.template.quick_replies)
      this.template.quick_replies = [];

    if (this.template.quick_replies.length === 11)
      throw new Error('There can not be more than 11 quick replies');

    // if (text.length > 20)
    //   text = breakText(text, 20)[0];

    let quickReply = {
      content_type: 'text',
      title: text,
      payload: payload
    };

    if (imageUrl) quickReply.image_url = imageUrl;

    this.template.quick_replies.push(quickReply);

    return this;
  }

  addQuickReplyLocation() {
    if (!this.template.quick_replies)
      this.template.quick_replies = [];

    if (this.template.quick_replies.length === 11)
      throw new Error('There can not be more than 11 quick replies');

    let quickReply = {
      content_type: 'location'
    };

    this.template.quick_replies.push(quickReply);

    return this;
  }

  get() {
    return this.template;
  }
}

module.exports = Template;