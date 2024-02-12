class ServerBanException {
    constructor(conn) {
        this.connection = conn;
    }

    async add(name, types, reason, set_by = null, duration = null) {
        const query = {
            name: name,
            exception_types: types,
            reason: reason,
        };

        if (set_by)
            query.set_by = set_by;

        if (duration)
            query.duration_string = duration;

        const response = await this.connection.query('server_ban_exception.add', query);

        if (typeof response === 'boolean')
            return false;

        if (response.tkl)
            return response.tkl;

        return false;
    }

    async delete(name) {
        const response = await this.connection.query('server_ban_exception.del', {
            name: name,
        });

        if (typeof response === 'boolean')
            return false;

        if (response.tkl)
            return response.tkl;

        return false;
    }

    async getAll() {
        const response = await this.connection.query('server_ban_exception.list', []);

        if (!typeof response === 'boolean') {
            return response.list;
        }

        throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
    }

    async get(name) {
        const response = await this.connection.query('server_ban_exception.get', {
            name: name,
        });

        if (!typeof response === 'boolean') {
            return response.tkl;
        }

        return false; // didn't exist
    }
}

module.exports = { ServerBanException };
