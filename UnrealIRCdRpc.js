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


const unrealircdRpc = {

    /* =======================
     * serverban (KLINE, GLINE…)
     * ======================= */
    async serverBanAdd(mask, type, duration, reason) {
        const urpc = await getURPC();
        return urpc.connection.serverban().add(mask, type, duration, reason);
    },

    async serverBanDelete(mask, type) {
        const urpc = await getURPC();
        return urpc.connection.serverban().delete(mask, type);
    },
        
    async gline(mask, duration, reason) {
        const urpc = await getURPC();
        return urpc.connection.serverban().add(mask, "gline", duration, reason);
    },

    async kline(mask, duration, reason) {
        const urpc = await getURPC();
        return urpc.connection.serverban().add(mask, "kline", duration, reason);
    },

    async serverBanGetAll() {
        const urpc = await getURPC();
        return urpc.connection.serverban().getAll();
    },

    async serverBanGet(mask, type) {
        const urpc = await getURPC();
        return urpc.connection.serverban().get(mask, type);
    },

    /* ===========================
     * serverbanexception (ELINE)
     * =========================== */
    async serverBanExceptionAdd(name, types, reason, set_by = null, duration = null) {
        const urpc = await getURPC();
        return urpc.connection.serverbanexception().add(
            name,
            types,
            reason,
            set_by,
            duration
        );
    },

    async serverBanExceptionDelete(name) {
        const urpc = await getURPC();
        return urpc.connection.serverbanexception().delete(name);
    },

    async serverBanExceptionGetAll() {
        const urpc = await getURPC();
        return urpc.connection.serverbanexception().getAll();
    },

    async serverBanExceptionGet(name) {
        const urpc = await getURPC();
        return urpc.connection.serverbanexception().get(name);
    },

    /* =====
     * user
     * ===== */
    async listUsers(object_detail_level = 2) {
        const urpc = await getURPC();
        return urpc.connection.user().getAll(object_detail_level);
    },

    async getUser(nick, object_detail_level = 4) {
        const urpc = await getURPC();
        return urpc.connection.user().get(nick, object_detail_level);
    },

    async setNick(nick, newnick) {
        const urpc = await getURPC();
        return urpc.connection.user().set_nick(nick, newnick);
    },

    async setUsername(nick, username) {
        const urpc = await getURPC();
        return urpc.connection.user().set_username(nick, username);
    },

    async setRealname(nick, realname) {
        const urpc = await getURPC();
        return urpc.connection.user().set_realname(nick, realname);
    },

    async setVhost(nick, vhost) {
        const urpc = await getURPC();
        return urpc.connection.user().set_vhost(nick, vhost);
    },

    async setUserMode(nick, mode, hidden = false) {
        const urpc = await getURPC();
        return urpc.connection.user().set_mode(nick, mode, hidden);
    },

    async setSnomask(nick, snomask, hidden = false) {
        const urpc = await getURPC();
        return urpc.connection.user().set_snomask(nick, snomask, hidden);
    },

    async setOper(
        nick,
        oper_account,
        oper_class,
        classVal = null,
        modes = null,
        snomask = null,
        vhost = null
    ) {
        const urpc = await getURPC();
        return urpc.connection.user().set_oper(
            nick,
            oper_account,
            oper_class,
            classVal,
            modes,
            snomask,
            vhost
        );
    },

    async joinChannel(nick, channel, key = null, force = false) {
        const urpc = await getURPC();
        return urpc.connection.user().join(nick, channel, key, force);
    },

    async partChannel(nick, channel, force = false) {
        const urpc = await getURPC();
        return urpc.connection.user().part(nick, channel, force);
    },

    async quitUser(nick, reason) {
        const urpc = await getURPC();
        return urpc.connection.user().quit(nick, reason);
    },

    async killUser(nick, reason) {
        const urpc = await getURPC();
        return urpc.connection.user().kill(nick, reason);
    },

    /* ========
     * channel
     * ======== */
    async listChannels(object_detail_level = 1) {
        const urpc = await getURPC();
        return urpc.connection.channel().getAll(object_detail_level);
    },

    async getChannel(channel, object_detail_level = 3) {
        const urpc = await getURPC();
        return urpc.connection.channel().get(channel, object_detail_level);
    },

    async setChannelMode(channel, modes, parameters) {
        const urpc = await getURPC();
        return urpc.connection.channel().set_mode(channel, modes, parameters);
    },

    async setChannelTopic(channel, topic, set_by = null, set_at = null) {
        const urpc = await getURPC();
        return urpc.connection.channel().set_topic(channel, topic, set_by, set_at);
    },

    async kick(channel, nick, reason) {
        const urpc = await getURPC();
        return urpc.connection.channel().kick(channel, nick, reason);
    },

    /* ==========
     * spamfilter
     * ========== */
    async spamfilterAdd(name, match_type, spamfilter_targets, ban_action, ban_duration, reason) {
        const urpc = await getURPC();
        return urpc.connection.spamfilter().add(
            name,
            match_type,
            spamfilter_targets,
            ban_action,
            ban_duration,
            reason
        );
    },

    async spamfilterDelete(name, match_type, spamfilter_targets, ban_action) {
        const urpc = await getURPC();
        return urpc.connection.spamfilter().delete(
            name,
            match_type,
            spamfilter_targets,
            ban_action
        );
    },

    async spamfilterGetAll() {
        const urpc = await getURPC();
        return urpc.connection.spamfilter().getAll();
    },

    async spamfilterGet(name, match_type, spamfilter_targets, ban_action) {
        const urpc = await getURPC();
        return urpc.connection.spamfilter().get(
            name,
            match_type,
            spamfilter_targets,
            ban_action
        );
    },

    /* ========
     * nameban
     * ======== */
    async namebanAdd(name, reason, duration = null, set_by = null) {
        const urpc = await getURPC();
        return urpc.connection.nameban().add(name, reason, duration, set_by);
    },

    async namebanDelete(name) {
        const urpc = await getURPC();
        return urpc.connection.nameban().delete(name);
    },

    async namebanGetAll() {
        const urpc = await getURPC();
        return urpc.connection.nameban().getAll();
    },

    async namebanGet(name) {
        const urpc = await getURPC();
        return urpc.connection.nameban().get(name);
    },

    /* =====
     * stats
     * ===== */
    async getStats(object_detail_level = 1) {
        const urpc = await getURPC();
        return urpc.connection.stats().get(object_detail_level);
    },

    /* ======
     * whowas
     * ====== */
    async whowasGet(nick = null, ip = null, object_detail_level = 2) {
        const urpc = await getURPC();
        return urpc.connection.whowas().get(nick, ip, object_detail_level);
    },

    /* ====
     * log
     * ==== */
    async logSubscribe(sources) {
        const urpc = await getURPC();
        return urpc.connection.log().subscribe(sources);
    },

    async logUnsubscribe() {
        const urpc = await getURPC();
        return urpc.connection.log().unsubscribe();
    },

    async logGetAll(sources = null) {
        const urpc = await getURPC();
        return urpc.connection.log().getAll(sources);
    },

    /* ========
     * message
     * ======== */
    async sendPrivmsg(nick, message) {
        const urpc = await getURPC();
        return urpc.connection.message().send_privmsg(nick, message);
    },

    async sendNotice(nick, message) {
        const urpc = await getURPC();
        return urpc.connection.message().send_notice(nick, message);
    },

    async sendNumeric(nick, numeric, message) {
        const urpc = await getURPC();
        return urpc.connection.message().send_numeric(nick, numeric, message);
    },

    async sendStandardReply(nick, type, code, context, description) {
        const urpc = await getURPC();
        return urpc.connection.message().send_standard_reply(
            nick,
            type,
            code,
            context,
            description
        );
    },

    /* ===============
     * securitygroup
     * =============== */
    async listSecurityGroups() {
        const urpc = await getURPC();
        return urpc.connection.securitygroup().getAll();
    },

    async getSecurityGroup(name) {
        const urpc = await getURPC();
        return urpc.connection.securitygroup().get(name);
    }
};


module.exports = { UnrealIRCdRpc, unrealircdRpc };
