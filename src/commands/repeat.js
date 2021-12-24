const { Command } = require('./command');
const { ServerModel } = require('../db');
const mongoose = require('mongoose');

function getSeconds(str) {
    let hrs = str.match(/(\d+)\s*h/);
    let mins = str.match(/(\d+)\s*m/);
    let secs = str.match(/(\d+)\s*s/);

    if (hrs)
        hrs = hrs[1];

    if (mins)
        mins = mins[1];

    if (secs)
        secs = secs[1];

    return (parseInt(hrs) || 0) * 3600 +
        (parseInt(mins) || 0) * 60 +
        (parseInt(secs) || 0);
};

function secsToStr(secsNum) {
    const hrs = Math.floor(secsNum / 3600);
    const mins = Math.floor((secsNum % 3600) / 60);
    const secs = secsNum % 60;

    if (hrs)
        return `${hrs} ${hrs != 1 ? 'hours' : 'hour'}, ${mins} ${mins != 1 ? 'mins' : 'min'}, ${secs} ${secs != 1 ? 'secs' : 'sec'}`
    else if (mins)
        return `${mins} ${mins != 1 ? 'mins' : 'min'}, ${secs} ${secs != 1 ? 'secs' : 'sec'}`
    else
        return `${secs} ${secs != 1 ? 'secs' : 'sec'}`
}

const ls = new Command(['ls'], [], {},)

Command.addCommand(new Command(['repeat', 'spam'], [], {}, async function (args, msg) {
    if (args.length != 3)
        return 'Usage: repeat <iteration count> <timeout> <text>';

    let iters = parseInt(args[0]);
    if (isNaN(iters) || iters < 1)
        return 'Invalid number!';

    let totalTimeout = getSeconds(args[1]);

    if (totalTimeout > 216000 || totalTimeout < 1)
        return 'Invalid timeout (24h >= time >= 1s)';

    const now = new Date();

    let repeatId = new mongoose.Types.ObjectId();
    let repeat;

    try {
        const doc = await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { $push: { repeats: { _id: repeatId, ch_id: msg.channelId, secs: totalTimeout, it_cnt: iters, creation_time: now, text: args[2] } } },
            { upsert: true, useFindAndModify: false, new: true }
        ).exec();

        repeat = doc.repeats.find(x => x._id.toString() === repeatId.toString());
    } catch (err) {
        return `ERROR: An error occurred. Try again later.`;
    }

    const interval = setInterval(() => {
        msg.channel.send(args[2]);

        iters--;

        if (iters == 0) {
            clearInterval(interval);

            ServerModel.findOneAndUpdate(
                { guild_id: msg.guild.id },
                { $pull: { repeats: { _id: repeatId } } },
                { upsert: true, useFindAndModify: false, returnOriginal: true },
            ).exec();
        }
    }, totalTimeout * 1000);

    return `Set interval ID ${repeat._id} for ${secsToStr(totalTimeout)}!`;
}));