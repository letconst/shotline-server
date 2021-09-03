const ItemManager = require('../ItemManager');

/**
 * クライアントからのアイテム情報初期化時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    ItemManager.maxGenerateCount = data.MaxItemGenerateCount;
    ItemManager.generateInterval = data.ItemGenerateInterval;
};
