class Rpc {
    constructor(connection) {
        this.connection = connection;
    }

    /**
     * Get information on all RPC modules loaded.
     * @returns {Promise<object|array|boolean>}
     */
    async info() {
        return await this.connection.query('rpc.info');
    }

    /**
     * Set the name of the issuer that will make all the following RPC request
     * (eg. name of logged in user on a webpanel). Requires UnreaIRCd 6.0.8+.
     * @param {string} name
     * @returns {Promise<object|array|boolean>}
     */
    async set_issuer(name) {
        return await this.connection.query('rpc.set_issuer', {
            name: name
        });
    }

    /**
     * Add a timer. Requires UnrealIRCd 6.1.0+
     * @param {string} timer_id Name of the timer (so you can .del_timer later)
     * @param {number} every_msec Every -this- milliseconds the command must be executed
     * @param {string} method The JSON-RPC method to execute (lowlevel name, eg "stats.get")
     * @param {array|null} params Parameters to the JSON-RPC call that will be executed, can be NULL
     * @param {*} id Set JSON-RPC id to be used in the timer, leave NULL for auto id.
     * @returns {Promise<object|array|boolean>}
     */
    async add_timer(timer_id, every_msec, method, params = null, id = null) {
        if (id === null)
            id = Math.floor(Math.random() * (999999 - 100000) + 100000); /* above the regular query() ids */

        const request = {
            jsonrpc: "2.0",
            method: method,
            params: params,
            id: id
        };

        return await this.connection.query('rpc.add_timer', {
            timer_id: timer_id,
            every_msec: every_msec,
            request: request
        });
    }

    /**
     * Delete a timer. Requires UnrealIRCd 6.1.0+
     * @param {string} timer_id Name of the timer that was added through del_timer earlier.
     * @returns {Promise<object|array|boolean>}
     */
    async del_timer(timer_id) {
        return await this.connection.query('rpc.del_timer', {
            timer_id: timer_id
        });
    }
}

module.exports = Rpc;
