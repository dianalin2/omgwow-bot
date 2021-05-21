const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

const { parse } = require('discord-command-parser');

// TODO: Implement DB
const triggers = {}

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on('message', msg => {

    const parsed = parse(msg, "~", { allowSpaceBeforeCommand: true });

    if (!triggers[msg.guild.id])
        triggers[msg.guild.id] = {};

    if (!parsed.success && msg.author.id !== client.user.id) {
        for (const s of Object.keys(triggers[msg.guild.id])) {
            if (msg.content.includes(s)) {
                msg.reply(triggers[msg.guild.id][s]);
            }
        }

        return;
    }

    const args = parsed.arguments;

    console.log(parsed.command);
    console.log(args);
    switch (parsed.command) {
        case 'responses':

            if (args.length < 2) {
                msg.reply('Usage: ~responses add|del ...');
                return;
            }

            if (args[0] === 'add') {
                if (args.length !== 3) {
                    msg.reply('Usage: ~responses add <trigger> <response>');
                    return;
                }

                triggers[msg.guild.id][args[1]] = args[2];
                msg.reply(`New response added:\nTrigger: ${args[1]}\nResponse: ${args[2]}`);
            } else if (args[0] === 'del') {
                if (args.length !== 3) {
                    msg.reply('Usage: ~responses del <trigger>');
                    return;
                }

                if (!triggers[msg.guild.id])
                    triggers[msg.guild.id] = {};

                if (!triggers[msg.guild.id[args[1]]]) {
                    msg.reply(`Response doesn't exist!`);
                }

                const res = triggers[msg.guild.id][args[1]];
                delete triggers[msg.guild.id][args[1]];
                msg.reply(`Response removed:\nTrigger: ${args[1]}\nResponse: ${res}`);
            }
            break;
        default:
            break;
    }

});

client.login(process.env.DISCORD_TOKEN);