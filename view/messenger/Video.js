const Template = require('./Template');
const helper = require('../../helpers/helper');



class Video extends Template {
  constructor(url) {
    super();

    if (!url || !helper.isUrl(url))
      throw new Error('Video template requires a valid URL as a first parameter');

    this.template = {
      attachment: {
        type: 'video',
        payload: {
          url: url
        }
      }
    };
  }
}

module.exports = Video;
