const NetworkHandler = require('../utils/NetworkHandler');

/**
 * ラウンド進行時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    data.Rival = data.Self;
    data.Self  = null;

    NetworkHandler.broadcast(data, clients, server);
}
