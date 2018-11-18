const Template = require('./Template');
const helper = require('../../helpers/helper');




class Generic extends Template {
  constructor() {
    super();

    this.bubbles = [];

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: []
        }
      }
    };
  }

  useSquareImages() {
    this.template.attachment.payload.image_aspect_ratio = 'square';

    return this;
  }

  getLastBubble() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    return this.bubbles[this.bubbles.length - 1];
  }

  addBubble(title, subtitle) {
    if (this.bubbles.length === 10)
      throw new Error('10 bubbles are maximum for Generic template');

    if (!title)
      throw new Error('Bubble title cannot be empty');

    if (title.length > 80)
      throw new Error('Bubble title cannot be longer than 80 characters');

    if (subtitle && subtitle.length > 80)
      throw new Error('Bubble subtitle cannot be longer than 80 characters');

    let bubble = {
      title: title
    };

    if (subtitle)
      bubble['subtitle'] = subtitle;

    this.bubbles.push(bubble);

    return this;
  }

  addUrl(url) {
    if (!url)
      throw new Error('URL is required for addUrl method');

    if (!helper.isUrl(url))
      throw new Error('URL needs to be valid for addUrl method');

    this.getLastBubble()['item_url'] = url;

    return this;
  }

  addImage(url) {
    if (!url)
      throw new Error('Image URL is required for addImage method');

    if (!helper.isUrl(url))
      throw new Error('Image URL needs to be valid for addImage method');

    this.getLastBubble()['image_url'] = url;

    return this;
  }

  addDefaultAction(url) {
    const bubble = this.getLastBubble();

    if (bubble.default_action)
      throw new Error('Bubble already has default action');

    if (!url)
      throw new Error('Bubble default action URL is required');

    if (!helper.isUrl(url))
      throw new Error('Bubble default action URL must be valid URL');

    bubble.default_action = {
      type: 'web_url',
      url: url
    };

    return this;
  }

  addButtonByType(title, value, type, options) {
    if (!title)
      throw new Error('Button title cannot be empty');

    const bubble = this.getLastBubble();

    bubble.buttons = bubble.buttons || [];

    if (bubble.buttons.length === 3)
      throw new Error('3 buttons are already added and that\'s the maximum');

    if (!title)
      throw new Error('Button title cannot be empty');

    const button = {
      title: title,
      type: type || 'postback'
    };

    if (type === 'web_url') {
      button.url = value;
    } else if (type === 'account_link') {
      delete button.title;
      button.url = value;
    } else if (type === 'phone_number') {
      button.payload = value;
    } else if (type === 'payment') {
      button.payload = value;
      button.payment_summary = options.paymentSummary;
    } else if (type === 'element_share' || type === 'account_unlink') {
      delete button.title;
      if (type === 'element_share' && options && typeof options.shareContent)
        button.share_contents = options.shareContent;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    bubble.buttons.push(button);

    return this;
  }

  addButton(title, value) {
    // Keeping this to prevent breaking change
    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Button value is required');

    if (helper.isUrl(value)) {
      return this.addButtonByType(title, value, 'web_url');
    } else {
      return this.addButtonByType(title, value, 'postback');
    }
  }

  addCallButton(title, phoneNumber) {
    if (!/^\+[0-9]{4,20}$/.test(phoneNumber))
      throw new Error('Call button value needs to be a valid phone number in following format: +1234567...');

    return this.addButtonByType(title, phoneNumber, 'phone_number');
  }

  addShareButton(shareContent) {
    return this.addButtonByType('Share', null, 'element_share', {
      shareContent: shareContent || null
    });
  }

  addBuyButton(title, value, paymentSummary) {
    if (!value)
      throw new Error('Button value is required');

    if (typeof paymentSummary !== 'object')
      throw new Error('Payment summary is required for buy button');

    return this.addButtonByType(title, value, 'payment', {
      paymentSummary: paymentSummary
    });
  }

  addLoginButton(url) {
    if (!helper.isUrl(url))
      throw new Error('Valid URL is required for Login button');

    return this.addButtonByType('Login', url, 'account_link');
  }

  addLogoutButton() {
    return this.addButtonByType('Logout', null, 'account_unlink');
  }

  get() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    this.template.attachment.payload.elements = this.bubbles;

    return this.template;
  }
}

module.exports = Generic;