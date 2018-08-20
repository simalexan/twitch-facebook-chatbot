'use strict';

const botBuilder = require('claudia-bot-builder');

module.exports = botBuilder(function (message) {

  if (message.text.includes('stream')) {
    return `Hey, my streams are usually happenning on Monday, Tuesday, Wednesday and Thursday from 6pm.`;
  }

  if (message.text.includes('twitch')) {
    return `You can find me on twitch on https://twitch.tv/simalexan`;
  }
  
  return message.text;
}, { platforms: ['facebook'] });