const Template = require('./Template');
const helper = require('../../helpers/helper');


class Audio extends Template {
  constructor(url) {
    super();

    if (!url || !helper.isUrl(url))
      throw new Error('Audio template requires a valid URL as a first parameter');

    this.template = {
      attachment: {
        type: 'audio',
        payload: {
          url: url
        }
      }
    };
  }
}

module.exports = Audio;

