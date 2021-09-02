const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

/**
 * ラウンド進行時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const room = RoomManager.getRoomByUuid(data.RoomUuid);

    // アイテム生成状況リセット
    room.itemManager.reset();
    NetworkHandler.broadcastToRoom(data, server, room);

    console.info('Round ended');
};
