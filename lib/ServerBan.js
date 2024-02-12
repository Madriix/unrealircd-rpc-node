class ServerBan {
    constructor(connection) {
        this.connection = connection;
    }

    async add(name, type, duration, reason) {
        try {
            const response = await this.connection.query('server_ban.add', {
                name: name,
                type: type,
                reason: reason,
                duration_string: duration || '1d',
            });

            if (typeof response === 'boolean') {
                return false;
            }

            if (response.tkl) {
                return response.tkl;
            }

            return false;
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    }

    async delete(name, type) {
        try {
            const response = await this.connection.query('server_ban.del', {
                name: name,
                type: type,
            });

            if (typeof response === 'boolean') {
                return false;
            }

            if (response.tkl) {
                return response.tkl;
            }

            return false;
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    }

    async getAll() {
        try {
            const response = await this.connection.query('server_ban.list');

            if (typeof response !== 'boolean') {
                return response.list;
            }

            throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    }

    async get(name, type) {
        try {
            const response = await this.connection.query('server_ban.get', {
                name: name,
                type: type,
            });

            if (typeof response !== 'boolean') {
                return response.tkl;
            }

            return false; // didn't exist
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    }
}

module.exports = ServerBan;
