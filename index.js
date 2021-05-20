const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    if (msg.content === 'ping') {
        msg.reply('pong');
    }
});

// bad
client.login('ODQ1MDc0OTM4MTEyMjQ1ODIw.YKbrXQ.Tfp0GLgaMiGeX15dI6ZKEFiy_rA');