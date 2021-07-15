const NetworkHandler = require('../utils/NetworkHandler');

/**
 * プレイヤー移動時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    data.Rival.bullet = data.Self.bullet;
    data.Self.bullet  = null;

    NetworkHandler.broadcastExceptSelf(data, sender, server, clients);
}