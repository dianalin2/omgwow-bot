const { Command } = require('./command');

const tablemark = require('tablemark');

const { ServerModel } = require('../db');

const add = new Command(['add'], [], {}, async function (args, msg) {
    if (args.length !== 2) {
        return 'Usage: ~responses add <trigger> <response>';
    }

    try {
        await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { $push: { triggers: { trigger: args[0], response: args[1] } } },
            { upsert: true, useFindAndModify: false }
        );
        return `New response added:\nTrigger: ${args[0]}\nResponse: ${args[1]}`;
    } catch (err) {
        return `ERROR: An error occurred. Try again later.`
    }
}, ['MANAGE_GUILD']);

const del = new Command(['del', 'delete'], [], {}, async function (args, msg) {
    if (args.length !== 1) {
        return 'Usage: ~responses del <trigger ID>';
    }

    try {
        await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { $pull: { triggers: { _id: args[0] } } },
            { upsert: true, useFindAndModify: false, returnOriginal: true },
        );

        const t = doc.triggers.find(x => args[1] === x._id.toString());
        if (!t) {
            res = `Response with ID ${args[0]} not found!`;
            return;
        }
        return `Response removed:\nTrigger: ${t.trigger}\nResponse: ${t.response}`;

    } catch (err) {
        return `Response with ID ${args[0]} not found!`;
    }
}, ['MANAGE_GUILD']);

const list = new Command(['ls', 'list'], [], {}, async function (args, msg) {
    if (args.length !== 0) {
        return 'Usage: ~responses list';
    }

    try {
        const doc = await ServerModel.findOne(
            { guild_id: msg.guild.id }, null, { upsert: true },
        ).exec();

        let data = [];
        doc.triggers.forEach(trigger => {
            if (!trigger.response)
                return;

            data.push({ 'ID': trigger._id, 'Trigger': trigger.trigger, 'Response': trigger.response });
        });

        const table = tablemark(data);

        return "```" + table + "```";
    } catch (err) {
        return `ERROR: An error occurred. Try again later.`;
    }
});

Command.addCommand(new Command(['responses'], [add, del, list], {
    'message': async function (msg) {
        var res = '';
        try {
            const doc = await ServerModel.findOne({ guild_id: msg.guild.id });
            doc.triggers.forEach(trigger => {
                if (!trigger.response)
                    return;
                if (msg.content.includes(trigger.trigger)) {
                    res += trigger.response + '\n';
                }
            });
        } catch (err) {
            return 'ERROR: An error occurred. Try again later.';
        }

        return res;
    }
}, function () {
    return this.help();
}));
