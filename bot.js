// Discord join link
// https://discordapp.com/oauth2/authorize?&client_id=610577812260257914&scope=bot&permissions=51200
const Discord = require('discord.js');
const fetch = require('node-fetch');

require('dotenv').config();

(async () => {
  try {
    const fetched = await fetch('https://mtgjson.com/json/CompiledList.json');
    const { files } = await fetched.json();
    const bot = new Discord.Client();

    const send = (channel, message, formatted = true) => {
      let newMessage = formatted
        ? `Here's your file: https://mtgjson.com/json/${message}.\n\nCheck out the website for the documentation!`
        : message;
      channel.reply(newMessage);
    };

    bot.on('ready', () => {
      console.log('MTGJSON Fetcher is connected!');
    });

    bot.on('message', message => {
      let [trigger, cmd] = message.content.split(' ');

      try {
        switch (trigger) {
          case '!f':
          case '!get':
          case '!fetch':
            const desire = cmd.split('.')[0];

            if (files.includes(desire)) {
              if (!cmd.includes('.')) {
                cmd = cmd + '.json';
              }
              send(message, cmd);
            } else {
              possibleFiles = files.filter(file => file.indexOf(desire) > -1);

              send(
                message,
                `Sorry, I can't find that file. ${
                  possibleFiles.length > 0
                    ? 'Did you mean any of these? **' + possibleFiles.join(', ') + '**'
                    : ''
                }`,
                false
              );
            }
            break;
        }
      } catch (err) {
        console.error('An error occured when trying to parse the Discord message.');
      }
    });

    bot.login(process.env.BOT_TOKEN);
  } catch (err) {
    console.error('An error occured while trying to fetch the file list.');
  }
})();
