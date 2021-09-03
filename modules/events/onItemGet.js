const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

/**
 * クライアントのアイテム取得時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const room = RoomManager.getRoomByUuid(data.RoomUuid);
    room.itemManager.generatedCount--;
    room.itemManager.startGenerate();

    NetworkHandler.broadcastExceptSelfToRoom(data, sender, server, room);
};
