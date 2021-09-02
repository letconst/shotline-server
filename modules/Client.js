const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {Object} Client
 * @property {string} uuid - UUID
 */

class Client {
    constructor() {
        this.uuid = uuidv4();
    }
}

module.exports = Client;
