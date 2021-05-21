const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

// TODO: Implement DB
const triggers = {}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {
    if (msg.author.bot)
        return;

    if (!triggers[msg.guild.id])
        triggers[msg.guild.id] = {};

    for (const s of Object.keys(triggers[msg.guild.id])) {
        if (msg.content.includes(s)) {
            msg.reply(triggers[msg.guild.id][s]);
        }
    }

    if (msg.content.startsWith('~')) {
        const command = msg.content.substring(1).match(/[^ ]+/g);
        console.log(command)
        switch (command[0]) {
            case 'responses':
                if (command.length < 2) {
                    msg.reply('Usage: ~responses add|del ...');
                    return;
                }

                if (command[1] === 'add') {
                    if (command.length != 4) {
                        msg.reply('Usage: ~responses add <trigger> <response>');
                        return;
                    }

                    triggers[msg.guild.id][command[2]] = command[3];
                    msg.reply(`New response added:\nTrigger: ${command[2]}\nResponse: ${command[3]}`);
                } else if (command[1] === 'del') {
                    if (command.length != 4) {
                        msg.reply('Usage: ~responses del <trigger>');
                        return;
                    }

                    if (!triggers[msg.guild.id])
                        triggers[msg.guild.id] = {};

                    if (!triggers[msg.guild.id[command[2]]]) {
                        msg.reply(`Response doesn't exist!`);
                    }

                    const res = triggers[msg.guild.id][command[2]];
                    delete triggers[msg.guild.id][command[2]];
                    msg.reply(`Response removed:\nTrigger: ${command[2]}\nResponse: ${res}`);
                }
                break;
            default:
                break;
        }
    }

});

client.login(process.env.DISCORD_TOKEN);