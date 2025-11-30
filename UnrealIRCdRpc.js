const Connection = require('./lib/Connection');

const address = "wss://ApiUser:api-user-password@127.0.0.1:8600/";

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

            //const address = "wss://ApiUser:api-user-password@127.0.0.1:8600/";
            const rpc = new UnrealIRCdRpc(address);
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

module.exports = UnrealIRCdRpc;
