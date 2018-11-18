const Template = require('./Template');


class Text extends Template {
  constructor(text) {
    super();

    if (!text)
      throw new Error('Text is required for text template');

    this.template = {
      text: text
    };
  }
}

module.exports = Text;