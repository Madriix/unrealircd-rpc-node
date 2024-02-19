class User {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll(object_detail_level = 2) {
        const response = await this.connection.query('user.list', {
            object_detail_level: object_detail_level,
        });

        if (!typeof response === 'boolean') {
            return response.list;
        }

        throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
    }

    async get(nick, object_detail_level = 4) {
        const response = await this.connection.query('user.get', {
            nick: nick,
            object_detail_level: object_detail_level,
        });

        if (!typeof response === 'boolean') {
            return response.client;
        }

        return false; // not found
    }

    async set_nick(nick, newnick) {
        return this.connection.query('user.set_nick', {
            nick: nick,
            newnick: newnick,
        });
    }

    async set_username(nick, username) {
        return this.connection.query('user.set_username', {
            nick: nick,
            username: username,
        });
    }

    async set_realname(nick, realname) {
        return this.connection.query('user.set_realname', {
            nick: nick,
            realname: realname,
        });
    }

    async set_vhost(nick, vhost) {
        return this.connection.query('user.set_vhost', {
            nick: nick,
            vhost: vhost,
        });
    }

    async set_mode(nick, mode, hidden = false) {
        return this.connection.query('user.set_mode', {
            nick: nick,
            modes: mode,
            hidden: hidden,
        });
    }

    async set_snomask(nick, snomask, hidden = false) {
        return this.connection.query('user.set_snomask', {
            nick: nick,
            snomask: snomask,
            hidden: hidden,
        });
    }

    async set_oper(nick, oper_account, oper_class, classVal = null, modes = null, snomask = null, vhost = null) {
        return this.connection.query('user.set_oper', {
            nick: nick,
            oper_account: oper_account,
            oper_class: oper_class,
            class: classVal,
            modes: modes,
            snomask: snomask,
            vhost: vhost,
        });
    }

    async join(nick, channel, key = null, force = false) {
        return this.connection.query('user.join', {
            nick: nick,
            channel: channel,
            key: key,
            force: force,
        });
    }

    async part(nick, channel, force = false) {
        return this.connection.query('user.part', {
            nick: nick,
            channel: channel,
            force: force,
        });
    }

    async quit(nick, reason) {
        return this.connection.query('user.quit', {
            nick: nick,
            reason: reason,
        });
    }

    async kill(nick, reason) {
        return this.connection.query('user.kill', {
            nick: nick,
            reason: reason,
        });
    }
}

module.exports = User;
