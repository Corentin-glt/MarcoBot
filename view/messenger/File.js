const Template = require('./Template');
const helper = require('../../helpers/helper');




class File extends Template {
  constructor(url) {
    super();

    if (!url || !helper.isUrl(url))
      throw new Error('File attachment template requires a valid URL as a first paramether');

    this.template = {
      attachment: {
        type: 'file',
        payload: {
          url: url
        }
      }
    };
  }
}

module.exports = File;