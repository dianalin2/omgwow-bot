const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

const { ServerModel } = require('./db')

client.on("guildCreate", guild => {
    console.log(`Added to new server :) ${guild.name}`);
    ServerModel.create({
        guild_id: guild.id,
        triggers: []
    });
});

client.on('guildDelete', guild => {
    console.log(`Removed from server :( ${guild.name}`);
    ServerModel.remove({ guild_id: guild.id });
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
    client.user.setPresence({ activity: { name: '~help' }, status: 'online' });
});

const { Command } = require('./commands/command');
Command.init(client);

require('./commands/util');
require('./commands/responses');
require('./commands/mee6-rank');
require('./commands/random');

if (!process.env.DEBUG)
    client.login(process.env.DISCORD_TOKEN);
else
    client.login(process.env.DEV_DISCORD_TOKEN);
