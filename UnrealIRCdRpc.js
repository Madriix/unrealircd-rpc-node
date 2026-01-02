const Connection = require('./lib/Connection');

class UnrealIRCdRpc {
    static instance = null;

    constructor(address, options = { tls_verify: false }) {
        this.address = address;
        this.options = options;
        this.connection = null;
    }

    static async getInstance() {
        try {
            if (this.instance) return this.instance;

            if (!this.address) {
                throw new Error("UnrealIRCdRpc.address is not defined");
            }

            //const address = "wss://ApiUser:api-user-password@127.0.0.1:8600/";
            const rpc = new UnrealIRCdRpc(this.address);
            await rpc.connect();
            this.instance = rpc;
            return rpc;

        } catch (err) {
            console.error("Unable to connect to RPC:", err);
            return null;
        }
    }

    async connect() {
        if (this.connection) return;

        this.connection = new Connection(this.address, this.options);

        await new Promise((resolve, reject) => {

            this.connection.connection.once('open', () => {
                console.log('Connection established successfully.');
                resolve();
            });

            this.connection.connection.once('error', (error) => {
                console.error('Connection error:', error);
                this.close();
                UnrealIRCdRpc.instance = null;
                reject(error);
            });

            this.connection.connection.once('close', () => {
                console.log('Connection closed.');
                this.connection = null;
                UnrealIRCdRpc.instance = null;
            });
        });
    }

    close() {
        if (this.connection) {
            this.connection.close();
            this.connection = null;
        }
    }
}

let urpcInstance = null;

async function getURPC() {
    if (!urpcInstance) {
        urpcInstance = await UnrealIRCdRpc.getInstance();

        if (!urpcInstance) {
            throw new Error("Unable to connect to the UnrealIRCd RPC.");
        }
    }
    return urpcInstance;
}


let unrealircd = {
    async gline(mask, duration, reason) {
        const urpc = await getURPC();
        return urpc.connection.serverban().add(mask, "gline", duration, reason);
    },

    async kline(mask, duration, reason) {
        const urpc = await getURPC();
        return urpc.connection.serverban().add(mask, "kline", duration, reason);
    },

    async send_privmsg(nick, msg) {
        const urpc = await getURPC();
        await urpc.connection.message().send_privmsg(nick, msg);
    },

    async listSecurityGroups() {
        const urpc = await getURPC();
        return await urpc.connection.securitygroup().getAll();
    }

    // Continue building later.
};

module.exports = { UnrealIRCdRpc, unrealircd };
