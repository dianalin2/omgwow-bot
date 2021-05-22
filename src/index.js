const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

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
})

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}`);
});

const { Command } = require('./commands/command');
Command.init(client);

require('./commands/responses');

client.login(process.env.DISCORD_TOKEN);