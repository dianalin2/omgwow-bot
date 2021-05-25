const { parse } = require('discord-command-parser');
const { ServerModel } = require('../db');

class Command {
    static commands = [];
    static client;

    static init(client) {
        if (client == null)throw new Error('No client was specified!');
    Command.client = client; client.on('message', msg => {ServerModel.findOne({ guild_id: msg.guild.id }, null, { upsert: true }).then(server => {const parsed = parse(msg, server.prefix || '~', { allowSpaceBeforeCommand: true, allowBots: true });const x = res.body;if (!parsed.success && msg.author.id !== client.user.id) {for (const cmd of Command.commands) {
                        if (cmd.msgCallback) {
                            cmd.msgCallback(msg, server).then(res => {
                                if (res && res.channel !== undefined) {
if (res.body.length <= 2000)
                                        res.channel.send(res.body);
                                    else{
                                    var temp = x;
                                    var ret = "";
                                                                    var lsf = 0;
                                    var ind = temp.indexOf('\n');
                                        while(ind!=-1){
                                        ind = temp.indexOf('\n');
                                        // console.log(ind);
                                        // console.log(temp);
                                        if(lsf+ind+1<998){
                                            lsf+=temp.indexOf('\n')+1;
                                            ret+=temp.substring(0, ind+1);
                                            temp= temp.substring(ind+1, temp.length);
                                        }else{
                                            break;
                                        }
                                    }
                                    var ret2 = "";
                                    temp = x.split("").reverse().join(""); 
                                    var lsf = 0;
                                    var ind = temp.indexOf('\n');
                                    while(ind!=-1){
                                        ind = temp.indexOf('\n');
                                        // console.log(ind);
                                        // console.log(temp);
                                        if(lsf+ind+1<998){
                                            lsf+=temp.indexOf('\n')+1;
                                            ret2+=temp.substring(0, ind+1);
                                            temp= temp.substring(ind+1, temp.length);
                                        }else{
                                            break;
                                        }
                                    }
                                    
                                    ret2 = ret2.split("").reverse().join("");
                                    msg.channel.send(ret+ret2)}             } else if (res) {
                                    if (res.length <= 2000)
                                        msg.channel.send(res);
                                    else{
                                        var temp = x;
var ret = "";
var lsf = 0;
var ind = temp.indexOf('\n');
while(ind!=-1){
ind = temp.indexOf('\n');
    // console.log(ind);
            // console.log(temp);
if(lsf+ind+1<998){
                lsf+=temp.indexOf('\n')+1;
        ret+=temp.substring(0, ind+1);
        temp= temp.substring(ind+1, temp.length);
  }else{
                            break;
    }
}
var ret2 = "";
temp = x.split("").reverse().join(""); 
        var lsf = 0;
var ind = temp.indexOf('\n');
while(ind!=-1){
    ind = temp.indexOf('\n');
    // console.log(ind);
                            // console.log(temp);
    if(lsf+ind+1<998){
        lsf+=temp.indexOf('\n')+1;
        ret2+=temp.substring(0, ind+1);
        temp= temp.substring(ind+1, temp.length);
    }else{
        break;
    }
}

ret2 = ret2.split("").reverse().join("");
msg.channel.send(ret+ret2);}
                                }
                            });
                        }
                    }
                } else if (msg.author.id !== client.user.id) {
                    Command.executeCommand(parsed.command, parsed.arguments, msg).then(res => {
                        if (res) {
                            if (res.length <= 2000)
                                msg.channel.send(res);
                            else
                                msg.channel.send(res.substring(0, 998) + "\n...\n" + res.substring(res.length - 997));
                        }
                    });
                }
            }).catch(_ => {
                msg.channel.send('ERROR: An error occurred. Try again later.');
            });
        });


        console.log("Commands initialized!");
    }

    constructor(cmdNames, subcommands = [], socketCallbacks = {}, execCallback = null, permsRequired = ['SEND_MESSAGES']) {
        this.commandNames = cmdNames;
        this.subcommands = subcommands;
        this.socketCallbacks = socketCallbacks;

        for (const e of Object.keys(socketCallbacks)) {
            if (e === 'message') {
                this.msgCallback = socketCallbacks[e];
            } else {
                Command.client.on(e, socketCallbacks[e]);
            }
        }
        this.execCallback = execCallback;
        this.permsRequired = permsRequired;
    }

    async exec(args, msg) {
        if (args[0] === '--help') {
            return this.help();
        }

        if (!msg.member.hasPermission(this.permsRequired)) {
            msg.reply('bad perms');
            return;
        }

        if (args.length > 0) {
            for (const sc of this.subcommands) {
                if (sc.commandNames.includes(args[0])) {
                    args.shift();
                    return sc.exec(args, msg);
                }
            }
        }

        if (this.execCallback)
            return this.execCallback(args, msg);
        else
            return "";
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
                return c.exec(args, msg);
            }
        }

        return '';
    }

    static help() {
        let res = '';

        for (let i = 0; i < Command.commands.length - 1; i++) {
            res += Command.commands[i].commandNames[0] + '|';
        }

        if (Command.commands.length > 0)
            res += Command.commands[Command.commands.length - 1].commandNames[0];

        return 'Usage: ' + res;
    }
}

module.exports.Command = Command;
