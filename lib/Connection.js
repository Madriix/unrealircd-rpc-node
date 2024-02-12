const WebSocket = require('ws');
const ServerBan = require('../lib/ServerBan');
const Rpc = require('../lib/Rpc');
const ServerBanException = require('../lib/ServerBanException');
const Channel = require('../lib/Channel');
const Log = require('../lib/Log');
const NameBan = require('../lib/NameBan');
const Server = require('../lib/Server');
const Spamfilter = require('../lib/Spamfilter');
const Stats = require('../lib/Stats');
const User = require('../lib/User');

class Connection {
    constructor(uri, options = {}) {
        const context = options.context || {};

        if (options.tls_verify === false) {
            context.ssl = context.ssl || {};
            context.ssl.verify_peer = false;
            context.ssl.verify_peer_name = false;
        }

        this.connection = new WebSocket(uri);

        this.connection.on('open', () => {
            if (options.issuer) {
                this.connection.send(JSON.stringify({
                    type: 'rpc.set_issuer',
                    name: options.issuer,
                }));
            } else {
                this.connection.send(JSON.stringify({ type: 'ping' }));
            }
        });

        this.connection.on('error', (error) => {
        });

        this.connection.on('close', () => {

        });
    }


    /**
     * Encode and send a query to the RPC server.
     *
     * @note I'm not sure on the response type except that it may be either an object or array.
     *
     * @param  string  $method
     * @param  array|null  $params
     * @param  bool  $no_wait
     *
     * @return object|array|bool
     * @throws Exception
     */

    async query(method, params = null, no_wait = false) {
        const id = generateRandomId();

        const rpc = {
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: id
        };

        const json_rpc = JSON.stringify(rpc);
        this.connection.send(json_rpc);

        if (no_wait) return true;

        const starttime = Date.now();
        return new Promise((resolve, reject) => {
            const handleReply = (reply) => {

                const parsedReply = JSON.parse(reply);
                if (parsedReply.id !== id) {
                    return; // Not our request, ignore
                }

                if (parsedReply.result) {
                    this.errno = 0;
                    this.error = null;
                    this.connection.removeListener('message', handleReply);
                    resolve(parsedReply.result);
                }

                if (parsedReply.error) {
                    this.errno = parsedReply.error.code;
                    this.error = parsedReply.error.message;
                    this.connection.removeListener('message', handleReply);
                    reject(false);
                }

                if (Date.now() - starttime > 10000) {
                    this.connection.removeListener('message', handleReply);
                    reject(new Error('RPC request timed out'));
                }
            };

            this.connection.on('message', handleReply);
        });
    };

    rpc() {
        return new Rpc(this);
    }

    stats() {
        return new Stats(this);
    }

    user() {
        return new User(this);
    }

    channel() {
        return new Channel(this);
    }

    serverban() {
        return new ServerBan(this);
    }

    spamfilter() {
        return new Spamfilter(this);
    }

    nameban() {
        return new NameBan(this);
    }

    server() {
        return new Server(this);
    }

    serverbanexception() {
        return new ServerBanException(this);
    }

    log() {
        return new Log(this);
    }
}

function generateRandomId() {
    return Math.floor(Math.random() * 99999) + 1;
}

module.exports = Connection;
