const { ServerModel } = require('../db');
const { Command } = require('./command');

Command.addCommand(new Command(['help'], [], {}, function () {
    return 'Please see https://github.com/dianalin2/omgwow-bot/blob/main/README.md#commands for command reference!';
}));

Command.addCommand(new Command(['prefix'], [], {}, async function (args, msg) {
    if (args.length !== 1) {
        return `Usage: prefix <prefix>`;
    }

    try {
        await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { prefix: args[0] },
            { upsert: true, useFindAndModify: false }
        ).exec();
        return `Prefix set to ${args[0]}`;
    } catch (err) {
        return `ERROR: An error occurred. Try again later.`;
    }
}, ['MANAGE_GUILD']));