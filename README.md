# omgwow-bot
A Discord bot for a bunch of random utilities.

## Commands
Prefix: `~`
* `responses` - Auto-responds to a message whenever a "trigger" is detected 
    * `add <trigger> <response>` - Add a trigger and response
    * `del <trigger ID>` - Delete a trigger (based on trigger ID)
    * `ls` - List all triggers for the server

## Build and Run with Docker
1. Configure the environment with `DISCORD_TOKEN`, `DB_NAME`, `DB_USER`, and `DB_PASSWORD`

2. Build and run
```
docker build . -t omgwow:latest
docker run omgwow:latest
```

## License
This project is licensed under the GNU General Public License. See [LICENSE](./LICENSE) for details.
