const { Command } = require("./command")

const number = new Command(["number", "num"], [], {}, function(args, msg) {
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

Command.addCommand(new Command(["random", "rand"], [number], {}, function(_, _) {

}))