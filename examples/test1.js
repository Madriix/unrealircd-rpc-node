/*
 Manual installation :
 const { UnrealIRCdRpc, unrealircd } = require('./unrealircd-rpc-node/UnrealIRCdRpc');
*/
const { UnrealIRCdRpc, unrealircdRpc } = require('unrealircd-rpc-node');

// Set the correct address and port for your UnrealIRCd RPC.
UnrealIRCdRpc.address = "wss://ApiUser:api-user-password@127.0.0.1:8600/";

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
        const urpc = await UnrealIRCdRpc.getInstance();

        if (!urpc) {
            console.log("Unable to connect to the UnrealIRCd RPC.");
            return;
        }

        await urpc.connection.message().send_privmsg("TestNick", "Test message");

        // urpc.close();

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