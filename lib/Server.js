class Server {
    constructor(conn) {
        this.connection = conn;
    }

    async getAll() {
        const response = await this.connection.query('server.list');

        if (!typeof response === 'boolean') {
            return response.list;
        }

        throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
    }

    async get(server = null) {
        const response = await this.connection.query('server.get', { server: server });

        if (!typeof response === 'boolean') {
            return response.server;
        }

        return false; // not found
    }

    async rehash(serv) {
        return this.connection.query('server.rehash', { server: serv });
    }

    async connect(name) {
        return this.connection.query('server.connect', { link: name });
    }

    async disconnect(name, reason = "No reason") {
        return this.connection.query('server.disconnect', {
            link: name,
            reason: reason
        });
    }

    async module_list(name = null) {
        const arr = {};
        if (name)
            arr.server = name;

        return this.connection.query('server.module_list', arr);
    }
}

module.exports = { Server };
