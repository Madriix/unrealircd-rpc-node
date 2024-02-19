class NameBan {
    constructor(connection) {
        this.connection = connection;
    }

    async add(name, reason, duration = null, set_by = null) {
        const query = {
            name: name,
            reason: reason,
            duration_string: duration || '0',
        };

        if (set_by)
            query.set_by = set_by;

        const response = await this.connection.query('name_ban.add', query);

        if (typeof response === 'boolean')
            return false;

        if (response.tkl)
            return response.tkl;
        return false;
    }

    async delete(name) {
        const response = await this.connection.query('name_ban.del', {
            name: name,
        });

        if (typeof response === 'boolean')
            return false;

        if (response.tkl)
            return response.tkl;
        return false;
    }

    async getAll() {
        const response = await this.connection.query('name_ban.list');

        if (!typeof response === 'boolean') {
            return response.list;
        }

        throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
    }

    async get(name) {
        const response = await this.connection.query('name_ban.get', {
            name: name,
        });

        if (!typeof response === 'boolean') {
            return response.tkl;
        }

        return false; // not found
    }
}

module.exports = NameBan;
