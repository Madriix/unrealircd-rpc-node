UnrealIRCd RPC for Node.js
==============

This allows a Node.js bot like [irc-framework](https://github.com/kiwiirc/irc-framework) to control UnrealIRCd via the JSON-RPC interface.

Installation
------------
1) Download https://github.com/Madriix/unrealircd-rpc-node.git
2) Rename the folder `unrealircd-rpc-node-main` to `unrealircd-rpc-node`
3) Add `unrealircd-rpc-node` to the same folder as your node bot
  

Bot setup (with [IRC-framework](https://github.com/kiwiirc/irc-framework))
-----------------
UnrealIRCd 6.0.6 or later is needed and you need to enable
[JSON-RPC](https://www.unrealircd.org/docs/JSON-RPC) in it.
After doing that, be sure to rehash the IRCd.

Usage
-----
Here is an example with [IRC-framework](https://github.com/kiwiirc/irc-framework)
```js
let unreal_rpc = null;

async function UnrealIRCdRpc() {
    if (!unreal_rpc) {
        const Connection = require('./unrealircd-rpc-node/lib/Connection');
        const address = "wss://user:api-user-password@irc.server.com:8600/"; // Open the port in firewall for remote server

        unreal_rpc = new Connection(address, { tls_verify: false });

        let openPromise = new Promise((resolve, reject) => {
            unreal_rpc.connection.on('open', () => {
                console.log('Connection established successfully.');
                resolve(unreal_rpc);
            });

            unreal_rpc.connection.on('error', (error) => {
                console.error('Connexion error:', error);
                unreal_rpc.close();
                unreal_rpc = null;
                reject(error);
            });

            unreal_rpc.connection.on('close', () => {
                console.log('Connection closed.');
                unreal_rpc = null;
            });
        });

        try {
            await openPromise;
        } catch (error) {
            console.error('An error occurred:', error);
        }

    }

    return unreal_rpc;
}
```

Then here's how to use it:
```js
bot.on('message', async function (event) {
    console.log('<' + event.nick + '>', event.message);
    console.log(event);

    if (!/^#/.test(event.target) && /^node/.test(event.message)) {

        unreal_rpc = await UnrealIRCdRpc();

        await unreal_rpc.serverban().add("~account:test", "gline", "60", "no reason");

        await unreal_rpc.serverban().getAll()
            .then(bans => {
                bans.forEach(ban => {
                    bot.raw(`PRIVMSG ${event.nick} There's a ${ban.type} on ${ban.name}`);
                });
            })
            .catch(error => { });

        // unreal_rpc.connection.close();
    }
});
```
Just go to the bot's private account and type "node", it will answer you
and add a gline to ~account:test.

If the example does not work, then make sure you have configured your
UnrealIRCd correctly, with the same API username and password you use
here, with an allowed IP, and changing the `wss://127.0.0.1:8600/` too
if needed.

Please note that I only tested the ServerBan.js class. I don't know if the others work. 
I was inspired by the code [unrealircd-rpc-php](https://github.com/unrealircd/unrealircd-rpc-php) by copying.
I use it on an irc-framework bot, it works well for ServerBan (add/del/list).


Commmands available (not all tested)
```js
// serverban : The server_ban.* JSON RPC calls can add, remove and list server bans such as KLINE, GLINE, etc. 
await rpc.serverban().add("~account:test", "gline", "60", "no reason");
await rpc.serverban().delete("~account:test", "gline");
await rpc.serverban().getAll();
await rpc.serverban().get("~account:test", "gline");

// serverbanexception : The server_ban_exception.* JSON RPC calls can add, remove and list server ban exceptions (ELINEs). 
await rpc.serverbanexception().add(name, types, reason, set_by = null, duration = null)
await rpc.serverbanexception().delete(name)
await rpc.serverbanexception().getAll()
await rpc.serverbanexception().get(name)

// user : The user.* JSON RPC calls can list and retrieve information about users. 
await rpc.user().getAll(object_detail_level = 2)
await rpc.user().get(nick, object_detail_level = 4)
await rpc.user().set_nick(nick, newnick)
await rpc.user().set_username(nick, username)
await rpc.user().set_realname(nick, realname)
await rpc.user().set_vhost(nick, vhost)
await rpc.user().set_mode(nick, mode, hidden = false)
await rpc.user().set_snomask(nick, snomask, hidden = false)
await rpc.user().set_oper(nick, oper_account, oper_class, classVal = null, modes = null, snomask = null, vhost = null)
await rpc.user().join(nick, channel, key = null, force = false)
await rpc.user().part(nick, channel, force = false)
await rpc.user().quit(nick, reason)
await rpc.user().kill(nick, reason)

// channel : The channel.* JSON RPC calls can list and retrieve information about channels. 
await rpc.channel().getAll(object_detail_level = 1)
await rpc.channel().get(channel, object_detail_level = 3)
await rpc.channel().set_mode(channel, modes, parameters)
await rpc.channel().set_topic(channel, topic, set_by = null, set_at = null)
await rpc.channel().kick(channel, nick, reason)

// spamfilter : The spamfilter.* JSON RPC calls can add, remove and list spamfilters. 
await rpc.spamfilter().add(name, match_type, spamfilter_targets, ban_action, ban_duration, reason)
await rpc.spamfilter().delete(name, match_type, spamfilter_targets, ban_action)
await rpc.spamfilter().getAll()
await rpc.spamfilter().get(name, match_type, spamfilter_targets, ban_action)

// nameban : The name_ban.* JSON RPC calls can add, remove and list banned nicks and channels (q-lines).
await rpc.nameban().add(name, reason, duration = null, set_by = null)
await rpc.nameban().delete(name)
await rpc.nameban().getAll()
await rpc.nameban().get(name)

// stats : Get some quick basic statistics. This is for example used by the admin panel for the 'Overview' page. 
await rpc.stats().get(object_detail_level = 1)

// whowas : The whowas.* JSON RPC calls retrieve whowas history of users. 
await rpc.whowas().get(nick = null, ip = null, object_detail_level = 2)

// log : The log.* JSON RPC calls allow you to subscribe and unsubscribe to log events (real-time streaming of JSON logs).  
await rpc.log().subscribe(sources)
await rpc.log().unsubscribe()
await rpc.log().getAll(sources = null)
```
