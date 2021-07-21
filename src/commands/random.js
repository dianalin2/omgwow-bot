const { Command } = require("./command")

const number = new Command(["number", "num"], [], {}, function(args, _) {
    if (args.length != 0 && args.length != 2) {
        return 'Usage: random number <a> <b>';
    }

    try {
        let a = parseInt(args[0]) || 1;
        let b = parseInt(args[1]) || 10;

        if (a > b)
            [a, b] = [b, a];

        return `The number **${Math.floor(Math.random() * (b - a + 1)) + a}** is my favorite between ${a} and ${b}!`;
    } catch (err) {
        return "Invalid arguments!";
    }
});

const choices = new Command(["choices", "choice", "ch"], [], {}, function(args) {
    if (args.length == 0)
        return 'Usage: random number <...args>';

    return args[Math.floor(Math.random() * args.length)];
});

Command.addCommand(new Command(["random", "rand"], [number, choices], {}, function(_, _) {

}));