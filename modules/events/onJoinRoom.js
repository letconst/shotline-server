const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');
const { eventType }  = require('../definitions/Definitions');

require('../utils/initializer').dotenv();
const { MAX_CONNECTIONS } = process.env;

/**
 * ルーム参加要求時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = async (data, sender, server) => {
    const room      = RoomManager.getRoomByUuid(data.RoomUuid);
    data.IsJoinable = false;

    // 他のルームに参加済みか確認
    if (RoomManager.getRoomByClient(data.Client.uuid)) {
        data.Message = 'すでに他のルームに参加しています';
    } else {
        if (room) {
            if (room.clientCount < Number(MAX_CONNECTIONS)) {
                data.IsJoinable = true;
                data.Client     = RoomManager.joinClientToRoom(room.uuid, sender);
                data.IsOwner    = room.clientCount === 1;
            } else {
                data.Message = 'ルームが満員です';
            }
        } else {
            data.Message = 'ルームが存在しません';
        }
    }

    NetworkHandler.emit(data, sender, server);

    // 全員揃ったらそれを通知
    if (room.clientCount === Number(MAX_CONNECTIONS)) {
        await new Promise(resolve => {
            setTimeout(resolve, 500);
        });

        const req = {
            Type: eventType.MatchComplete
        };

        NetworkHandler.broadcastToRoom(req, server, room);
    }
};
