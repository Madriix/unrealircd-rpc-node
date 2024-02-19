class Whowas {
    constructor(connection) {
        this.connection = connection;
    }

    async get(nick = null, ip = null, object_detail_level = 2) {
        return this.connection.query('whowas.get', {
            nick: nick,
            ip: ip,
            object_detail_level: object_detail_level,
        });
    }
}

module.exports = Whowas;
