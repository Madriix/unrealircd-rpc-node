class Spamfilter {
    constructor(conn) {
        this.connection = conn;
    }

    async add(name, match_type, spamfilter_targets, ban_action, ban_duration, reason) {
        const response = await this.connection.query('spamfilter.add', {
            name: name,
            match_type: match_type,
            spamfilter_targets: spamfilter_targets,
            ban_action: ban_action,
            ban_duration: ban_duration,
            reason: reason,
        });

        if (typeof response === 'boolean')
            return false;

        if (response.tkl)
            return response.tkl;
        return false;
    }

    async delete(name, match_type, spamfilter_targets, ban_action) {
        const response = await this.connection.query('spamfilter.del', {
            name: name,
            match_type: match_type,
            spamfilter_targets: spamfilter_targets,
            ban_action: ban_action,
        });

        if (typeof response === 'boolean')
            return false;

        if (response.tkl)
            return response.tkl;
        return false;
    }

    async getAll() {
        const response = await this.connection.query('spamfilter.list');

        if (!typeof response === 'boolean') {
            return response.list;
        }

        throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
    }

    async get(name, match_type, spamfilter_targets, ban_action) {
        const response = await this.connection.query('spamfilter.get', {
            name: name,
            match_type: match_type,
            spamfilter_targets: spamfilter_targets,
            ban_action: ban_action,
        });

        if (!typeof response === 'boolean') {
            return response.tkl;
        }

        return false; // not found
    }
}

module.exports = { Spamfilter };
