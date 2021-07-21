const { Command } = require("./command")

const number = new Command(["number", "num"], [], {}, function(args) {
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

const yn = new Command(["yn", "coinflip", "cf"], [], {}, function(args) {
    if (args.length != 1 && args.length != 0)
        return 'Usage: random coinflip <arg>';

    const arg = args[0] || "";

    if (Math.random() > 0.5) {
        if (arg !== "")
            return `It would be very wise to ${arg}.`;
        else
            return `Logic says yes.`;
    } else {
        if (arg !== "")
            return `To ${arg} would be a bad idea.`;
        else
            return `Logic says no.`;
    }
})

Command.addCommand(new Command(["random", "rand"], [number, choices, yn], {}, function(_, _) {

}));