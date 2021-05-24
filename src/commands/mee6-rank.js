const { Command } = require('./command');

const Mee6LevelsApi = require("mee6-levels-api");

const { ServerModel } = require('../db');

const MEE6ID = "159985870458322944";

const toggleOn = new Command(['on'], [], {}, async function (_, msg) {
    try {
        await Mee6LevelsApi.getLeaderboardPage(msg.guild.id);

        await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { 'mee6_rank.toggle': true },
            { upsert: true, useFindAndModify: false }
        );

    } catch (err) {
        return `MEE6 isn't on this server!`;
    }

    return 'MEE6 top rank announcement is now turned on!';
});

const toggleOff = new Command(['off'], [], {}, async function (_, msg) {
    try {
        await Mee6LevelsApi.getLeaderboardPage(msg.guild.id);

        await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { 'mee6_rank.toggle': false },
            { upsert: true, useFindAndModify: false }
        );

    } catch (err) {
        return `MEE6 isn't on this server!`;
    }

    return 'MEE6 top rank announcement is now turned off!';
});

const toggle = new Command(['toggle'], [toggleOn, toggleOff], {}, function () {
    return this.help();
});

const setAnnouncementMessage = new Command(['set-announce-msg'], [], {}, async function (args, msg) {
    if (args.length !== 1) {
        return 'Usage: mee6-rank config set-announce-msg <msg>';
    }

    try {
        const doc = await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { 'mee6_rank.announce_message': args[0] },
            { upsert: true, useFindAndModify: false, returnOriginal: true },
        ).exec();

        if (!doc) {
            return `ERROR: An error occurred. Try again later.`
        }

        return `Set announcement message to: ${args[0]}`;

    } catch (err) {
        return `ERROR: An error occurred. Try again later.`
    }
});

const setAnnouncementChannel = new Command(['set-announce-channel'], [], {
    channelDelete: async function (ch) {
        try {
            const server = await ServerModel.findOne({ guild_id: ch.guild.id });

            if (server.mee6_rank.announce_ch_id === ch.id) {
                await ServerModel.findOneAndUpdate(
                    { guild_id: ch.guild.id },
                    { 'mee6_rank.announce_ch_id': '' },
                    { upsert: true, useFindAndModify: false, returnOriginal: true },
                ).exec();
            }
        } catch (err) {
            return;
        }
    }
}, async function (args, msg) {
    if (args.length !== 1) {
        return 'Usage: mee6-rank config set-announce-msg <channel ID>';
    }

    try {
        const ch = msg.guild.channels.cache.get(args[0]);
        if (!ch)
            return `Channel doesn't exist!`;
        const doc = await ServerModel.findOneAndUpdate(
            { guild_id: msg.guild.id },
            { 'mee6_rank.announce_ch_id': args[0] },
            { upsert: true, useFindAndModify: false, returnOriginal: true },
        ).exec();

        if (!doc) {
            return `ERROR: An error occurred. Try again later.`
        }

        return `Set announcement channel to: ${ch}`;

    } catch (err) {
        return `ERROR: An error occurred. Try again later.`
    }
});

const config = new Command(['config'], [setAnnouncementMessage, setAnnouncementChannel], {}, function () {
    return this.help();
})

Command.addCommand(new Command(['mee6-rank'], [toggle, config], {
    'message': async function (msg, serverData) {
        if (!serverData.mee6_rank || !serverData.mee6_rank.toggle)
            return '';

        const userData = await Mee6LevelsApi.getUserXp(msg.guild.id, msg.author.id);

        if (userData.rank === 1 && userData.id !== serverData.mee6_rank.top_user_id) {
            await ServerModel.findOneAndUpdate(
                { guild_id: msg.guild.id },
                { 'mee6_rank.top_user_id': userData.id },
                { upsert: true, useFindAndModify: false }
            );

            const announcement = serverData.mee6_rank.announce_message || '{user} is now rank #1!';

            const channelId = serverData.mee6_rank.announce_ch_id;
            if (channelId && msg.guild.channels.cache.get(channelId))
                return { body: announcement.replace('{user}', userData.tag), channel: msg.guild.channels.cache.get(channelId) };
        }
    },
    'guildMemberRemove': async function (mem) {
        if (mem.user.id === MEE6ID) {
            try {
                await ServerModel.findOneAndUpdate(
                    { guild_id: msg.guild.id },
                    { 'mee6_rank.toggle': false },
                    { upsert: true, useFindAndModify: false }
                );
            } catch (err) {
            }
        }
    }
}, function () {
    return this.help();
}, ['MANAGE_GUILD']));
