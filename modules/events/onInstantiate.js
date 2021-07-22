const NetworkHandler = require('../utils/NetworkHandler');

/**
 * アイテム生成時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    NetworkHandler.broadcastExceptSelf(data, sender, server, clients);
};
