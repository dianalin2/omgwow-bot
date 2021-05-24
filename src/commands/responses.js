const { Command } = require('./command');

const tablemark = require('tablemark');

const { ServerModel } = require('../db');

const add = new Command(['add'], [], {}, async function (args, msg) {
    if (args.length !== 2 && args.length !== 3) {
        return 'Usage: responses add <trigger> <response> <optional: whole word match? (y/n) (default: y)>';
    }

    if (args[0] === '' || args[1] === '' || args[1].length >= 4000)
        return 'ERROR: daniel moment';

    let wholeWordMatch;
    if (args[2])
        wholeWordMatch = args[2] === 'y';
    else
        wholeWordMatch = true;

    try {
        await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { $push: { triggers: { trigger: args[0], response: args[1], whole_word_match: wholeWordMatch } } },
            { upsert: true, useFindAndModify: false }
        ).exec();
        return `New response added:\nTrigger: ${args[0]}\nResponse: ${args[1]}`;
    } catch (err) {
        return `ERROR: An error occurred. Try again later.`
    }
}, ['MANAGE_GUILD']);

const del = new Command(['del', 'delete'], [], {}, async function (args, msg) {
    if (args.length !== 1) {
        return 'Usage: responses del <trigger ID>';
    }

    try {
        const doc = await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { $pull: { triggers: { _id: args[0] } } },
            { upsert: true, useFindAndModify: false, returnOriginal: true },
        ).exec();

        const t = doc.triggers.find(x => args[0] === x._id.toString());
        if (!t) {
            return `Response with ID ${args[0]} not found!`;
        }

        return `Response removed:\nTrigger: ${t.trigger}\nResponse: ${t.response}`;

    } catch (err) {
        return `Response with ID ${args[0]} not found!`;
    }
}, ['MANAGE_GUILD']);

const list = new Command(['ls', 'list'], [], {}, async function (args, msg) {
    if (args.length !== 0) {
        return 'Usage: responses list';
    }

    try {
        const doc = await ServerModel.findOne(
            { guild_id: msg.guild.id }, null, { upsert: true },
        ).exec();

        let data = [];
        doc.triggers.forEach(trigger => {
            if (!trigger.response)
                return;

            data.push({ 'ID': trigger._id, 'Trigger': trigger.trigger, 'Response': trigger.response, 'Whole Word Match': trigger.whole_word_match });
        });

        const table = tablemark(data);

        return "```" + table + "```";
    } catch (err) {
        return `ERROR: An error occurred. Try again later.`;
    }
});

Command.addCommand(new Command(['responses'], [add, del, list], {
    'message': async function (msg, server) {
        var res = '';
        server.triggers.forEach(trigger => {
            if (!trigger.response)
                return;
            if ((msg.content.includes(trigger.trigger) && !trigger.whole_word_match) ||
                (trigger.whole_word_match && containsSequence(msg.content.split(' '), trigger.trigger.split(' ')))) {
                res += trigger.response + '\n';
            }
        });
        return res;
    }
}, function () {
    return this.help();
}));

function containsSequence(arr, seqArr) {
    if (arr.length < seqArr.length)
        return false;

    for (let i = 0; i < arr.length; i++) {
        let found = true;
        for (let j = 0; j < seqArr.length; j++) {
            if (arr[i + j] !== seqArr[j]) {
                found = false;
                break;
            }
        }

        if (found)
            return true;
    }

    return false;
}