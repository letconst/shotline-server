const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');
const { eventType }  = require('../definitions/Definitions');

/**
 * 切断時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const { RoomUuid, ClientUuid } = data;

    // 参加ルームからは削除
    if (!RoomManager.removeClientFromRoom(ClientUuid)) return;

    console.info(`${sender.address}:${sender.port} is disconnected`);

    const room = RoomManager.getRoomByUuid(RoomUuid);

    if (!room) return;

    room.itemManager.reset();

    const newReq = {
        Type     : eventType.Refresh,
        RivalUuid: ClientUuid
    };

    NetworkHandler.broadcastToRoom(newReq, server, room);
};
