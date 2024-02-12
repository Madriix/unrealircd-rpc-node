UnrealIRCd RPC for Node.js
==============

This allows a Node.js bot like [irc-framework](https://github.com/kiwiirc/irc-framework) to control UnrealIRCd via the JSON-RPC interface.

Installation
------------
Add the "unrealircd-rpc-node" folder in the same directory as your Node bot.
  

Bot setup (with irc-framework)
-----------------
UnrealIRCd 6.0.6 or later is needed and you need to enable
[JSON-RPC](https://www.unrealircd.org/docs/JSON-RPC) in it.
After doing that, be sure to rehash the IRCd.

Usage
-----
Here is an example with [IRC-framework](https://github.com/kiwiirc/irc-framework)
```js
const Connection = require('./unrealircd-rpc-node/lib/Connection');
const address = "wss://user:api-user-password@irc.server.com:8600/"; // Open the port in firewall for remote server

let rpc = null;

async function Rpc() {
    if (!rpc) {
        rpc = new Connection(address, { tls_verify: false });

        let openPromise = new Promise((resolve, reject) => {
            rpc.connection.on('open', () => {
                console.log('Connexion établie avec succès.');
                resolve(rpc);
            });

            rpc.connection.on('error', (error) => {
                console.error('Erreur de connexion:', error);
                rpc.close();
                rpc = null;
                reject(error);
            });

            rpc.connection.on('close', () => {
                console.log('Connexion fermée.');
                rpc = null;
            });
        });

        try {
            await openPromise;
        } catch (error) {
            console.error('An error occurred:', error);
        }

    }

    return rpc;
}
```

Then here's how to use it:
```js
bot.on('message', async function (event) {
	console.log('<' + event.nick + '>', event.message);
	console.log(event);

	if (!/^#/.test(event.target) && /^node/.test(event.message)) {

		rpc = await Rpc();

		rpc.serverban().add("~account:test", "gline", "60", "no reason");

		setTimeout(() => {
			rpc.serverban().getAll()
			.then(bans => {
				bans.forEach(ban => {
					bot.raw(`PRIVMSG ${event.nick} There's a ${ban.type} on ${ban.name}`);
				});
				//rpc.connection.close();
			})
			.catch(error => {});
		}, 2000);
	}
});
```
Just go to the bot's private account and type "node", it will answer you
and add a gline to ~account:test.

If the example does not work, then make sure you have configured your
UnrealIRCd correctly, with the same API username and password you use
here, with an allowed IP, and changing the `wss://127.0.0.1:8600/` too
if needed.

Please note that I only tested the ServerBan.js class. I don't know if the others work. I was inspired by
the code [unrealircd-rpc-php](https://github.com/unrealircd/unrealircd-rpc-php) by copying.
I use it on an irc-framework bot, it works well for ServerBan/add/del/list.

I added setTimeout because it looks like a second command doesn't want to run immediately right after another.


