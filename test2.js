const { UnrealIRCdRpc, unrealircdRpc } = require('unrealircd-rpc-node');

// Set the correct address and port for your UnrealIRCd RPC.
UnrealIRCdRpc.address = "wss://ApiUser:api-user-password@127.0.0.1:8600/";

// ...

bot.on('message', async function (event) {
    console.log('<' + event.nick + '>', event.message);
    console.log(event);

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_1$/.test(event.message)) {

        await unrealircdRpc.serverBanAdd(
            "~account:test",
            "gline",
            "60",
            "Abuse"
        );

    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_2$/.test(event.message)) {

        const bans = await unrealircdRpc.serverBanGetAll();
        for (const ban of bans) {
            bot.raw(`PRIVMSG ${event.nick} :There's a ${ban.type} on ${ban.name}`);
        }

    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_3$/.test(event.message)) {

        await unrealircdRpc.sendPrivmsg("TestNick", "Test message");

    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_4$/.test(event.message)) {

        await unrealircdRpc.sendNumeric(
            "Nick",
            318,
            "End of /WHOIS list."
        );

    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_5$/.test(event.message)) {

        const securitygroups = await unrealircdRpc.listSecurityGroups();
        for (const group of securitygroups) {
            bot.raw(`PRIVMSG ${event.nick} :Security-Group : ${group.name}`);
        }

    }

    if (!/^#/.test(event.target) && /^!test_unrealircd_rpc_6$/.test(event.message)) {

        const group = await unrealircdRpc.getSecurityGroup(
            "unknown-users"
        );

        if (group) {
            bot.raw(`PRIVMSG ${event.nick} Security-Group ${group.name}`);
            for (const [key, value] of Object.entries(group)) {
                bot.raw(`PRIVMSG ${event.nick} :${key} = ${value}`);
            }
        }

    }

});