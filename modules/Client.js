const { v4: uuidv4 } = require('uuid');

/**
 * @typedef {Object} Client
 * @property {string} uuid - UUID
 */

class Client {
    /**
     * @type {string}
     */
    uuid;

    /**
     * @type {boolean}
     */
    isRoomReady;

    /**
     * @type {RemoteInfo}
     */
    #remoteInfo;

    /**
     * @param {RemoteInfo} remoteInfo
     */
    constructor(remoteInfo) {
        this.uuid        = uuidv4();
        this.#remoteInfo = remoteInfo;
    }

    /**
     * @return {RemoteInfo}
     */
    get remoteInfo() {
        return this.#remoteInfo;
    }
}

module.exports = Client;
