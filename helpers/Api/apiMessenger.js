/**
 * Created by corentin on 02/05/2018.
 */
const Config = require('../../config');
const axios = require('axios');
const qs = require('qs');
const request = require('request');

module.exports = {
  headParams: {
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/x-www-form-urlencoded',
    }
  },
  sendToFacebook: (data) => {
    return axios.post(`https://graph.facebook.com/v2.6/me/messages?access_token=${Config.tokenAppFacebook}`, data);
  },

  receiveProfileFacebook: (psid) => {
    return axios.get(`https://graph.facebook.com/v2.6/${psid}?fields=first_name,name,last_name,profile_pic,locale,timezone,gender&access_token=${Config.tokenAppFacebook}`);
  },
  callbackStartButton: (data) => {
    return axios.post(`https://graph.facebook.com/v2.6/me/messenger_profile?access_token=${Config.tokenAppFacebook}`,data);
  }
};