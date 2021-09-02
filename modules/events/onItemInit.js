const RoomManager = require('../RoomManager');

/**
 * クライアントからのアイテム情報初期化時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const room = RoomManager.getRoomByUuid(data.RoomUuid);

    room.itemManager.maxGenerateCount = data.MaxItemGenerateCount;
    room.itemManager.generateInterval = data.ItemGenerateInterval;
};
