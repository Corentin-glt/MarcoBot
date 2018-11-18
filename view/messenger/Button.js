const Template = require('./Template');
const helper = require('../../helpers/helper');

class Button extends Template {
  constructor(text) {
    super();

    if (!text)
      throw new Error('Button template text cannot be empty');

    if (text.length > 640)
      throw new Error('Button template text cannot be longer than 640 characters');

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: text,
          buttons: []
        }
      }
    };
  }

  addButtonByType(title, value, type, options) {
    if (!title)
      throw new Error('Button title cannot be empty');

    if (this.template.attachment.payload.buttons.length === 3)
      throw new Error('3 buttons are already added and that\'s the maximum');

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

    this.template.attachment.payload.buttons.push(button);

    return this;
  }

  addButton(title, value) {
    // Keeping this to prevent breaking change
    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Button value is required');

    if (isUrl(value)) {
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
    if (!isUrl(url))
      throw new Error('Valid URL is required for Login button');

    return this.addButtonByType('Login', url, 'account_link');
  }

  addLogoutButton() {
    return this.addButtonByType('Logout', null, 'account_unlink');
  }

  get() {
    if (this.template.attachment.payload.buttons.length === 0)
      throw new Error('Add at least one button first!');

    return this.template;
  }
}


module.exports = Button;