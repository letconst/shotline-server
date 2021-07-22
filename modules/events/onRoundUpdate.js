const NetworkHandler = require('../utils/NetworkHandler');
const ItemManager    = require('../ItemManager');

/**
 * ラウンド進行時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    console.info('Round ended');

    data.Rival = data.Self;
    data.Self  = null;

    // アイテム生成状況リセット
    ItemManager.reset();

    NetworkHandler.broadcast(data, clients, server);
};
