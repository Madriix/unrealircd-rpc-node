class SecurityGroup {
    constructor(connection) {
        this.connection = connection;
    }

    async getAll() {
        try {
            const response = await this.connection.query('security_group.list');

            if (typeof response !== 'boolean') {
                return response.list;
            }

            throw new Error('Invalid JSON Response from UnrealIRCd RPC.');
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    }

    async get(name) {
        try {
            const response = await this.connection.query('security_group.get', {
                name: name
            });

            if (typeof response !== 'boolean') {
                return response;
            }

            return false; // didn't exist
        } catch (error) {
            console.error('An error occurred:', error);
            return false;
        }
    }
}

module.exports = SecurityGroup;
