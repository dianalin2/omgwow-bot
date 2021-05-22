const { parse } = require('discord-command-parser');

class Command {
    static commands = [];

    static init(client) {
        if (client == null)
            throw new Error('No client was specified!');

        client.on('message', msg => {
            const parsed = parse(msg, "~", { allowSpaceBeforeCommand: true });

            if (!parsed.success && msg.author.id !== client.user.id) {
                for (const cmd of Command.commands) {
                    if ('message' in cmd.socketCallbacks)
                        cmd.socketCallbacks['message'](msg).then(res => {
                            if (res)
                                msg.channel.send(res);
                        });
                }
            } else if (msg.author.id !== client.user.id) {
                Command.executeCommand(parsed.command, parsed.arguments, msg).then(res => {
                    if (res)
                        msg.channel.send(res);
                });
            }
        });

        console.log("Commands initialized!");
    };

    constructor(cmdNames, subcommands, socketCallbacks, execCallback) {
        this.commandNames = cmdNames;
        this.subcommands = subcommands;
        this.socketCallbacks = socketCallbacks;
        this.execCallback = execCallback;
    }

    async exec(args, msg) {
        if (args[0] === '--help') {
            return this.help();
        }

        if (args.length > 0) {
            for (const sc of this.subcommands) {
                if (sc.commandNames.includes(args[0])) {
                    args.shift();
                    return await sc.exec(args, msg);
                }
            }
        }

        return await this.execCallback(args, msg);
    }

    help() {
        let res = ' ';

        for (let i = 0; i < this.subcommands.length - 1; i++) {
            res += this.subcommands[i].commandNames[0] + '|';
        }

        if (this.subcommands.length > 0)
            res += this.subcommands[this.subcommands.length - 1].commandNames[0];

        return `Usage: ${this.commandNames[0]}` + res;
    }

    static addCommand(cmd) {
        Command.commands.push(cmd);
    }

    static async executeCommand(cmdName, args, msg) {

        for (const c of Command.commands) {
            if (c.commandNames.includes(cmdName)) {
                return await c.exec(args, msg);
            }
        }

        return Command.help();
    }

    static help() {
        return 'Usage: ~responses'
    }
}

module.exports.Command = Command;