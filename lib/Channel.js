class Channel {
    constructor(conn) {
        this.connection = conn;
    }

    async getAll(object_detail_level = 1) {
        const response = await this.connection.query('channel.list', {
            object_detail_level: object_detail_level,
        });

        if (!typeof response === 'boolean') {
            return response.list;
        }

        throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
    }

    async get(channel, object_detail_level = 3) {
        const response = await this.connection.query('channel.get', {
            channel: channel,
            object_detail_level: object_detail_level,
        });

        if (!typeof response === 'boolean') {
            return response.channel;
        }
        return false; // eg user not found
    }

    async set_mode(channel, modes, parameters) {
        return this.connection.query('channel.set_mode', {
            channel: channel,
            modes: modes,
            parameters: parameters,
        });
    }

    async set_topic(channel, topic, set_by = null, set_at = null) {
        return this.connection.query('channel.set_topic', {
            channel: channel,
            topic: topic,
            set_by: set_by,
            set_at: set_at,
        });
    }

    async kick(channel, nick, reason) {
        return this.connection.query('channel.kick', {
            nick: nick,
            channel: channel,
            reason: reason,
        });
    }
}

module.exports = { Channel };
