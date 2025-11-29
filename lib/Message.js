class Message {
    /**
     * @param {Connection} connection
     */
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Send a PRIVMSG to a user.
     * @param {string} nick
     * @param {string} message
     * @returns {Promise<object|array|boolean>}
     */
    send_privmsg(nick, message) {
        return this.connection.query('message.send_privmsg', {
            nick,
            message
        });
    }

    /**
     * Send a NOTICE to a user.
     * @param {string} nick
     * @param {string} message
     * @returns {Promise<object|array|boolean>}
     */
    send_notice(nick, message) {
        return this.connection.query('message.send_notice', {
            nick,
            message
        });
    }

    /**
     * Send a custom numeric message to a user.
     * @param {string} nick
     * @param {number} numeric
     * @param {string} message
     * @returns {Promise<object|array|boolean>}
     */
    send_numeric(nick, numeric, message) {
        return this.connection.query('message.send_numeric', {
            nick,
            numeric,
            message
        });
    }

    /**
     * Send a standard reply (IRCv3).
     * @param {string} nick
     * @param {string} type
     * @param {string} code
     * @param {string} description
     * @param {string|null} context
     * @returns {Promise<object|array|boolean>}
     */
    send_standard_reply(nick, type, code, description, context = null) {
        const params = {
            nick,
            type,
            code,
            description
        };

        if (context !== null) {
            params.context = context;
        }

        return this.connection.query('message.send_standard_reply', params);
    }
}

module.exports = Message;