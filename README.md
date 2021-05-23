# omgwow-bot
A Discord bot for a bunch of random utilities.

## Commands
Prefix: `~`
* `mee6-rank` - Additional features to having the top rank in MEE6 cooler
    * `toggle on|off` - Turn on/off `mee6-rank` for server (this defaults to off)
    * `config` - Configure `mee6-rank` features
        * `set-announce-channel <channel ID>` - Set #1 rank change announcement channel to a given channel
        * `set-announce-msg` - Set #1 rank change announcement format
            `{user}` can specify the tag of the new #1 ranked member
* `responses` - Auto-responds to a message whenever a "trigger" is detected 
    * `add <trigger> <response>` - Add a trigger and response
    * `delete <trigger ID>` - Delete a trigger (based on trigger ID)
        Aliases: `del`
    * `list` - List all triggers for the server
        Aliases: `ls`

## Build and Run with Docker

1. Configure the environment with `DISCORD_TOKEN`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`.
    * This project uses a MongoDB database hosted on MongoDB Atlas. You may need to change the URI in [db.js](./src/db.js) too.
    * Go through Discord bot setup [here](https://discord.com/developers/applications).


2. Build and run.
```
docker build . -t omgwow:latest
docker run omgwow:latest
```

3. Add to servers!

## Other Info
To remove commands from your local build, simply comment out the `require` line in [index.js](./src/index.js).

Example
```js
// require('./commands/responses');
```

## License
This project is licensed under the GNU General Public License. See [LICENSE](./LICENSE) for details.
