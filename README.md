UnrealIRCd RPC for Node.js
==============
[![Version](https://img.shields.io/badge/UnrealIRCd-6.0.6_or_later-darkgreen.svg)]()

This allows a Node.js bot like [irc-framework](https://github.com/kiwiirc/irc-framework) to control UnrealIRCd via the JSON-RPC interface.

Installation
------------
1) Install: `npm i unrealircd-rpc-node`
2) Code a little by integrating it with [IRC-framework](https://github.com/kiwiirc/irc-framework) or another library.


Manual installation
------------
1) Download https://github.com/Madriix/unrealircd-rpc-node.git
2) Rename the folder `unrealircd-rpc-node-main` to `unrealircd-rpc-node`
3) Add `unrealircd-rpc-node` to the same folder as your node bot
4) Install ws: `npm install ws`
5) Code a little by integrating it with [IRC-framework](https://github.com/kiwiirc/irc-framework) or another library.
  

Bot setup (with [IRC-framework](https://github.com/kiwiirc/irc-framework))
-----------------
UnrealIRCd 6.0.6 or later is needed and you need to enable
[JSON-RPC](https://www.unrealircd.org/docs/JSON-RPC) in it.
After doing that, be sure to rehash the IRCd.

Usage
-----
Here is an example with [IRC-framework](https://github.com/kiwiirc/irc-framework)
```js
/*
 Manual installation :
 const { UnrealIRCdRpc, unrealircd } = require('./unrealircd-rpc-node/UnrealIRCdRpc');
*/
const { UnrealIRCdRpc, unrealircdRpc } = require('unrealircd-rpc-node');
UnrealIRCdRpc.address = "wss://ApiUser:api-user-password@127.0.0.1:8600/"; // Set the correct address and port for your UnrealIRCd RPC.

// ...

bot.on('message', async function (event) {
    console.log('<' + event.nick + '>', event.message);
    console.log(event);

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_1$/.test(event.message)) {
        const urpc = await UnrealIRCdRpc.getInstance();

		if (!urpc) {
			console.log("Unable to connect to the UnrealIRCd RPC.");
			return;
		}

        await urpc.connection.serverban().add("~account:test", "gline", "60", "no reason");

        // urpc.close();
    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_2$/.test(event.message)) {
        const urpc = await UnrealIRCdRpc.getInstance();

		if (!urpc) {
			console.log("Unable to connect to the UnrealIRCd RPC.");
			return;
		}
        
        const bans = await urpc.connection.serverban().getAll();
        for (const ban of bans) {
            bot.raw(`PRIVMSG ${event.nick} :There's a ${ban.type} on ${ban.name}`);
        }

        // urpc.close();
    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_3$/.test(event.message)) {

		/* Method 1 */
		/*
        const urpc = await UnrealIRCdRpc.getInstance();

		if (!urpc) {
			console.log("Unable to connect to the UnrealIRCd RPC.");
			return;
		}

        await urpc.connection.message().send_privmsg("TestNick", "Test message");

        // urpc.close();
		*/

		/* Method 2 */
		await unrealircdRpc.sendPrivmsg("TestNick", "Test message");


    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_4$/.test(event.message)) {
        const urpc = await UnrealIRCdRpc.getInstance();

		if (!urpc) {
			console.log("Unable to connect to the UnrealIRCd RPC.");
			return;
		}

        await urpc.connection.message().send_numeric("TestNick", 318, "End of /WHOIS list.");

        // urpc.close();
    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_5$/.test(event.message)) {

		/* Method 1 */
		/*
        const urpc = await UnrealIRCdRpc.getInstance();

		if (!urpc) {
			console.log("Unable to connect to the UnrealIRCd RPC.");
			return;
		}

		const securitygrps = await urpc.connection.securitygroup().getAll();
		for (const group of securitygrps) {
			bot.raw(`PRIVMSG ${event.nick} :Security-Group : ${group.name}`);
		}

        // urpc.close();
		*/

		/* Method 2 */
		const securitygrps = await unrealircdRpc.listSecurityGroups();
		for (const group of securitygrps) {
			bot.raw(`PRIVMSG ${event.nick} :Security-Group : ${group.name}`);
		}
    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_6$/.test(event.message)) {
        const urpc = await UnrealIRCdRpc.getInstance();

		if (!urpc) {
			console.log("Unable to connect to the UnrealIRCd RPC.");
			return;
		}

		const securitygrps = await urpc.connection.securitygroup().get('unknown-users');

		if (securitygrps) {
			bot.raw(`PRIVMSG ${event.nick} Security-Group ${securitygrps.name}`);
			for (const [key, value] of Object.entries(securitygrps)) {
				bot.raw(`PRIVMSG ${event.nick} :${key} = ${value}`);
			}
		}

        // urpc.close();
    }

});
```
Just go to the bot's private account and type "!test_unrealircd_rpc_1", it will answer you and add a gline to ~account:test.

When testing the command "!test_unrealircd_rpc_2", you will see the list of bans.

By testing "!test_unrealircd_rpc_3", you will receive a message from the IRC server if you replace the nick TestNick with your own nick.

You can also test "!test_unrealircd_rpc_4" and others.



If the example does not work, then make sure you have configured your
UnrealIRCd correctly, with the same API username and password you use
here, with an allowed IP, and changing the `wss://127.0.0.1:8600/` too
if needed.

I was inspired by the code [unrealircd-rpc-php](https://github.com/unrealircd/unrealircd-rpc-php) by copying.
I use it on an irc-framework bot, it works well for ServerBan (add/del/list) and Message (send_privmsg, send_notice, send_numeric).

---

With `unrealircdRpc`, you can use the following commands:
---

## Server bans (KLINE / GLINE / etc.)

### Add a server ban

```js
await unrealircdRpc.serverBanAdd(
  "~account:test",
  "gline",
  3600,
  "Abuse"
);
```

### Remove a server ban

```js
await unrealircdRpc.serverBanDelete("~account:test", "gline");
```

### GLINE (shortcut)

```js
await unrealircdRpc.gline(
  "~account:baduser",
  600,
  "Flood"
);
```

### KLINE (shortcut)

```js
await unrealircdRpc.kline(
  "baduser@host",
  0,
  "Permanent ban"
);
```

### List all server bans

```js
const bans = await unrealircdRpc.serverBanGetAll();
```

### Get a specific server ban

```js
const ban = await unrealircdRpc.serverBanGet(
  "~account:test",
  "gline"
);
```

---

## Server ban exceptions (ELINE)

### Add an exception

```js
await unrealircdRpc.serverBanExceptionAdd(
  "~account:trusted",
  ["gline", "kline"],
  "Trusted user",
  "admin",
  3600
);
```

### Delete an exception

```js
await unrealircdRpc.serverBanExceptionDelete("~account:trusted");
```

### List all exceptions

```js
const elines = await unrealircdRpc.serverBanExceptionGetAll();
```

### Get a specific exception

```js
const eline = await unrealircdRpc.serverBanExceptionGet(
  "~account:trusted"
);
```

---

## Users

### List connected users

```js
const users = await unrealircdRpc.listUsers();
```

### Get a user

```js
const user = await unrealircdRpc.getUser("Nick");
```

### Change nickname

```js
await unrealircdRpc.setNick("OldNick", "NewNick");
```

### Change username

```js
await unrealircdRpc.setUsername("Nick", "newuser");
```

### Change realname

```js
await unrealircdRpc.setRealname("Nick", "Real Name");
```

### Set vHost

```js
await unrealircdRpc.setVhost("Nick", "user.example.org");
```

### Set user modes

```js
await unrealircdRpc.setUserMode("Nick", "+i");
```

### Set snomask

```js
await unrealircdRpc.setSnomask("Nick", "+s");
```

### Grant IRCop privileges

```js
await unrealircdRpc.setOper(
  "Nick",
  "oper_account",
  "netadmin"
);
```

### Join a channel

```js
await unrealircdRpc.joinChannel("Nick", "#channel");
```

### Part a channel

```js
await unrealircdRpc.partChannel("Nick", "#channel");
```

### Quit the network

```js
await unrealircdRpc.quitUser("Nick", "Bye");
```

### Kill a user

```js
await unrealircdRpc.killUser("Nick", "Policy violation");
```

---

## Channels

### List channels

```js
const channels = await unrealircdRpc.listChannels();
```

### Get a channel

```js
const channel = await unrealircdRpc.getChannel("#channel");
```

### Set channel modes

```js
await unrealircdRpc.setChannelMode("#channel", "+m", []);
```

### Set channel topic

```js
await unrealircdRpc.setChannelTopic(
  "#channel",
  "New topic"
);
```

### Kick a user

```js
await unrealircdRpc.kick(
  "#channel",
  "Nick",
  "Off-topic"
);
```

---

## Spamfilter

### Add a spamfilter

```js
await unrealircdRpc.spamfilterAdd(
  "badword",
  "simple",
  ["privmsg", "notice"],
  "block",
  0,
  "Forbidden word"
);
```

### Delete a spamfilter

```js
await unrealircdRpc.spamfilterDelete(
  "badword",
  "simple",
  ["privmsg", "notice"],
  "block"
);
```

### List all spamfilters

```js
const filters = await unrealircdRpc.spamfilterGetAll();
```

### Get a specific spamfilter

```js
const filter = await unrealircdRpc.spamfilterGet(
  "badword",
  "simple",
  ["privmsg"],
  "block"
);
```

---

## Name bans (Q-line)

### Add a nameban

```js
await unrealircdRpc.namebanAdd(
  "BadNick",
  "Reserved nickname",
  3600
);
```

### Delete a nameban

```js
await unrealircdRpc.namebanDelete("BadNick");
```

### List all namebans

```js
const namebans = await unrealircdRpc.namebanGetAll();
```

### Get a specific nameban

```js
const nameban = await unrealircdRpc.namebanGet("BadNick");
```

---

## Stats

```js
const stats = await unrealircdRpc.getStats();
```

---

## Whowas

```js
const history = await unrealircdRpc.whowasGet("OldNick");
```

---

## Logs

### Subscribe to logs

```js
await unrealircdRpc.logSubscribe(["server", "oper"]);
```

### Unsubscribe from logs

```js
await unrealircdRpc.logUnsubscribe();
```

### Get logs

```js
const logs = await unrealircdRpc.logGetAll();
```

---

## Messages

### Send a PRIVMSG

```js
await unrealircdRpc.sendPrivmsg(
  "Nick",
  "Hello world"
);
```

### Send a NOTICE

```js
await unrealircdRpc.sendNotice(
  "Nick",
  "This is a notice"
);
```

### Send a numeric

```js
await unrealircdRpc.sendNumeric(
  "Nick",
  123,
  "Custom numeric"
);
```

### Send a standard reply

```js
await unrealircdRpc.sendStandardReply(
  "Nick",
  "error",
  "NO_ACCESS",
  {},
  "Access denied"
);
```

---

## Security groups

### List security groups

```js
const groups = await unrealircdRpc.listSecurityGroups();
```

### Get a specific security group

```js
const group = await unrealircdRpc.getSecurityGroup(
  "unknown-users"
);
```

---

## Notes

* All methods return the raw UnrealIRCd RPC response
* Errors are propagated as-is
* Optional parameters follow the official UnrealIRCd API
* Not all commands have been tested by me, except for a few
* If you update it or find something that works, please let me know


---
## Old tutorial (still functional)

Commmands available (not all tested)
```js
// let rpc = await urpc.connection;

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

// message : The message.* JSON RPC calls can send_privmsg, send_notice, send_numeric, send_standard_reply. 
await rpc.message().send_privmsg("nick", "Test message");
await rpc.message().send_notice("nick", "Test notice");
await rpc.message().send_numeric(nick, numeric, message);
await rpc.message().send_standard_reply(nick, type, code, context, description);

// securitygroup : The security_group.* JSON RPC calls can list security groups
await rpc.securitygroup().getAll();
await rpc.securitygroup().get("unknown-users");
```