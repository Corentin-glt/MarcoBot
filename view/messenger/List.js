const Template = require('./Template');
const helper = require('../../helpers/helper');


class List extends Template {
  constructor(topElementStyle) {
    super();

    this.bubbles = [];

    this.template = {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'list',
          top_element_style: topElementStyle ? topElementStyle : 'large',
          elements: [],
          buttons: []
        }
      }
    };
  }

  getFirstBubble() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    return this.bubbles[0];
  }

  getLastBubble() {
    if (!this.bubbles || !this.bubbles.length)
      throw new Error('Add at least one bubble first!');

    return this.bubbles[this.bubbles.length - 1];
  }

  addBubble(title, subtitle) {
    if (this.bubbles.length === 4)
      throw new Error('4 bubbles are maximum for List template');

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

  addButton(title, value, type) {
    const bubble = this.getLastBubble();

    bubble.buttons = bubble.buttons || [];

    if (bubble.buttons.length === 1)
      throw new Error('One button is already added and that\'s the maximum');

    if (!title)
      throw new Error('Button title cannot be empty');

    if (!value)
      throw new Error('Button value is required');

    const button = {
      title: title
    };

    if (helper.isUrl(value)) {
      button.type = 'web_url';
      button.url = value;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    if (type) {
      button.type = type;
    }

    bubble.buttons.push(button);

    return this;
  }

  addShareButton() {
    const bubble = this.getLastBubble();

    bubble.buttons = bubble.buttons || [];

    if (bubble.buttons.length === 1)
      throw new Error('One button is already added and that\'s the maximum');
    const button = {
      type: 'element_share'
    };

    bubble.buttons.push(button);

    return this;
  }

  addListButton(title, value, type) {
    if (this.template.attachment.payload.buttons.length === 1)
      throw new Error('One List button is already added and that\'s the maximum');

    if (!title)
      throw new Error('List button title cannot be empty');

    if (!value)
      throw new Error('List button value is required');

    const button = {
      title: title
    };

    if (helper.isUrl(value)) {
      button.type = 'web_url';
      button.url = value;
    } else {
      button.type = 'postback';
      button.payload = value;
    }

    if (type) {
      button.type = type;
    }

    this.template.attachment.payload.buttons.push(button);

    return this;
  }

  get() {
    if (!this.bubbles || !this.bubbles.length || this.bubbles.length < 2)
      throw new Error('2 bubbles are minimum for List template!');

    if (this.template.attachment.payload.top_element_style === 'large' && !this.getFirstBubble()['image_url'])
      throw new Error('You need to add image to the first bubble because you use `large` top element style');

    this.template.attachment.payload.elements = this.bubbles;

    return this.template;
  }
}

module.exports = List;