const Template = require('./Template');
const helper = require('../../helpers/helper');


class Image extends Template {
  constructor(url) {
    super();

    if (!url || !helper.isUrl(url))
      throw new Error('Image template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: 'image',
        payload: {
          url: url
        }
      }
    };
  }
}

module.exports = Image;