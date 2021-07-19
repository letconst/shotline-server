const NetworkHandler = require('../utils/NetworkHandler');
const ItemManager    = require('../ItemManager');

/**
 * クライアントのアイテム取得時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    data.Rival = data.Self;
    data.Self  = null;

    NetworkHandler.broadcastExceptSelf(data, sender, server, clients);
    ItemManager.generatedCount--;
    ItemManager.startGenerate();
};
