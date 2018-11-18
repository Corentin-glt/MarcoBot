const Template = require('./Template');
const helper = require('../../helpers/helper');


class Attachment extends Template {
  constructor(url, type) {
    super();

    if (!url || !helper.isUrl(url))
      throw new Error('Attachment template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: type || 'file',
        payload: {
          url: url
        }
      }
    };
  }
}

module.exports = Attachment;