class Log {
    constructor(connection) {
        this.connection = connection;
    }

    async subscribe(sources) {
        return this.connection.query('log.subscribe', {
            sources: sources,
        });
    }

    async unsubscribe() {
        return this.connection.query('log.unsubscribe');
    }

    async getAll(sources = null) {
        const response = await this.connection.query('log.list', { sources: sources });

        if (typeof response !== 'boolean' && response.list)
            return response.list;

        return false;
    }
}

module.exports = Log;
