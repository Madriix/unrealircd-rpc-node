class Stats {
    constructor(connection) {
        this.connection = connection;
    }

    async get(object_detail_level = 1) {
        return this.connection.query('stats.get', {
            object_detail_level: object_detail_level,
        });
    }
}

module.exports = Stats;
