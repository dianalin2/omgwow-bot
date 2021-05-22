const Discord = require('discord.js');
const client = new Discord.Client();

const dotenv = require('dotenv');
dotenv.config();

const { parse } = require('discord-command-parser');

const { ServerModel } = require('./db');

const tablemark = require('tablemark');

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

client.on('message', msg => {

    const parsed = parse(msg, "~", { allowSpaceBeforeCommand: true });

    if (!parsed.success && msg.author.id !== client.user.id) {
        ServerModel.find({ guild_id: msg.guild.id }, function (err, docs) {
            for (const d of docs) {
                d.triggers.forEach(trigger => {
                    if (!trigger.response)
                        return;
                    if (msg.content.includes(trigger.trigger)) {
                        msg.reply(trigger.response);
                    }
                });
            }
        });

        return;
    }

    const args = parsed.arguments;

    switch (parsed.command) {
        case 'responses':
            if (!msg.member.hasPermission('MANAGE_CHANNELS')) {
                msg.reply('bad perms');
                return;
            }

            if (args.length < 1) {
                msg.reply('Usage: ~responses add|del|list ...');
                return;
            }

            if (args[0] === 'add') {
                if (args.length !== 3) {
                    msg.reply('Usage: ~responses add <trigger> <response>');
                    return;
                }

                ServerModel.findOneAndUpdate(
                    { guild_id: msg.guild.id },
                    { $push: { triggers: { trigger: args[1], response: args[2] } } },
                    { upsert: true, useFindAndModify: false },
                    () => {
                        msg.reply(`New response added:\nTrigger: ${args[1]}\nResponse: ${args[2]}`);
                    }
                );

            } else if (args[0] === 'del') {
                if (args.length !== 2) {
                    msg.reply('Usage: ~responses del <trigger ID>');
                    return;
                }

                ServerModel.findOneAndUpdate(
                    { guild_id: msg.guild.id },
                    { $pull: { triggers: { _id: args[1] } } },
                    { upsert: true, useFindAndModify: false, returnOriginal: true },
                    (err, doc) => {
                        if (err) {
                            msg.reply(`Response with ID ${args[1]} not found!`);
                        } else {
                            const t = doc.triggers.find(x => args[1] === x._id.toString());
                            if (!t) {
                                msg.reply(`Response with ID ${args[1]} not found!`);
                                return;
                            }
                            msg.reply(`Response removed:\nTrigger: ${t.trigger}\nResponse: ${t.response}`);
                        }
                    }
                );

            } else if (args[0] === 'list') {
                if (args.length !== 1) {
                    msg.reply('Usage: ~responses list');
                    return;
                }

                ServerModel.findOne(
                    { guild_id: msg.guild.id }, null, { upsert: true },
                    (err, doc) => {
                        if (err) {
                            msg.reply(`ERROR: An error occurred. Try again later.`)
                        } else {
                            let res = [];
                            doc.triggers.forEach(trigger => {
                                if (!trigger.response)
                                    return;

                                res.push({'ID': trigger._id, 'Trigger': trigger.trigger, 'Response': trigger.response});
                            });

                            const table = tablemark(res);
                            console.log(table);

                            msg.channel.send("```" + table + "```");
                        }
                    }
                )
            }
            break;
        default:
            break;
    }
});

client.login(process.env.DISCORD_TOKEN);