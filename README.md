# omgwow-bot
A Discord bot for a bunch of random utilities.

# Commands
Prefix: `~`
* `responses` - Auto-responds to a message whenever a "trigger" is detected 
    * `add <trigger> <response>` - Add a trigger and response
    * `del <trigger ID>` - Delete a trigger (based on trigger ID)
    * `list` - List all triggers for the server

## Build and Run with Docker
```
docker build . -t omgwow:latest
docker run omgwow:latest
```

## License
This project is licensed under the GNU General Public License. See [LICENSE](./LICENSE) for details.
