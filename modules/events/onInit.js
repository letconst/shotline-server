const { v4: uuidv4 } = require('uuid');
const NetworkHandler = require('../utils/NetworkHandler');

/**
 * 初回接続時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const thisPlayerUuid = uuidv4();

    data.Self.Uuid          = thisPlayerUuid;
    clients[thisPlayerUuid] = sender;

    NetworkHandler.emit(data, sender, server);
}