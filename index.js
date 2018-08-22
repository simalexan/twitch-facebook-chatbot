'use strict';
const botBuilder = require('claudia-bot-builder'),
  AWS = require('aws-sdk'),
  comprehend = new AWS.Comprehend(),
  SCHEDULE_REPLY = 'Hey, my streams are usually happenning on Monday, Tuesday, Wednesday and Thursday from 6pm.',
  CHANNEL_REPLY = 'Thanks for asking! This is my Twitch channel - https://twitch.tv/simalexan';

module.exports = botBuilder(function (message) {

  let currentReply = '',
    isScheduleInquiry = false, 
    isChannelInquiry = false;

  return comprehend.detectKeyPhrases({
    LanguageCode: 'en',
    Text: message.text
  }).promise()
    .then(response => {
      console.log(response);
      response.KeyPhrases.forEach(entity => {
        if (!isScheduleInquiry) isScheduleInquiry = isScheduleDetected(entity.Text);
        if (!isChannelInquiry) isChannelInquiry = isChannelDetected(entity.Text);
      });

      if (isScheduleInquiry) currentReply = SCHEDULE_REPLY;
      if (!isScheduleInquiry && isChannelInquiry) currentReply = CHANNEL_REPLY;

      return comprehend.detectSentiment({ LanguageCode: 'en', Text: message.text }).promise();
    }).then(response => {
      switch(response.Sentiment) {
        case 'NEGATIVE':
          currentReply += ` Sorry to hear that! Thank you, I'll try to improve!`
          break;
        case 'POSITIVE':
          currentReply += ' Thank you for your kind words!';
          break;
        default:
          break;
      }
      return currentReply;
    });
}, { platforms: ['facebook'] });

function isScheduleDetected(text) {
  return text.includes('schedule') || text.includes('time');
}

function isChannelDetected(text) {
  return text.includes('channel') || text.includes('Twitch');
}