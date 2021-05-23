const { Command } = require('./command');

Command.addCommand(new Command(['help'], [], {}, function () {
    return 'Please see https://github.com/dianalin2/omgwow-bot/blob/main/README.md#commands for command reference!';
}));