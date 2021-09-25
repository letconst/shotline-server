const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

/**
 * ルーム退出要求時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const room = RoomManager.getRoomByUuid(data.RoomUuid);

    // ルームがなければ通知
    if (!room) {
        data.Message    = 'ルームが存在しません';
        data.IsExitable = false;

        NetworkHandler.emit(data, sender, server);

        return;
    }

    // ルームに参加していなければ通知
    if (!room.getClientByUuid(data.ClientUuid)) {
        data.Message    = 'このルームに参加していません';
        data.IsExitable = false;

        NetworkHandler.emit(data, sender, server);

        return;
    }

    data.IsExitable = true;

    NetworkHandler.broadcastToRoomByUuid(data, server, data.RoomUuid);
    room.removeClient(data.ClientUuid);
};
