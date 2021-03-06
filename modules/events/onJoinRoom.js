const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

require('../utils/initializer').dotenv();
const { MAX_CONNECTIONS } = process.env;

/**
 * ルーム参加要求時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const room      = RoomManager.getRoomByUuid(data.RoomUuid);
    data.IsJoinable = false;

    // 他のルームに参加済みか確認
    if (RoomManager.getRoomByClient(data.Client.uuid)) {
        data.Message = 'すでに他のルームに参加しています';
    } else {
        if (room) {
            // ルーム最大人数に達していなければ適宜設定（正常に参加）
            if (room.clientCount < Number(MAX_CONNECTIONS)) {
                data.IsJoinable = true;
                data.Client     = RoomManager.joinClientToRoom(room.uuid, sender);
                data.IsOwner    = room.clientCount === 1;

                room.startIdleCheck();
            } else {
                data.Message = 'ルームが満員です';
            }
        } else {
            data.Message = 'ルームが存在しません';
        }
    }

    NetworkHandler.emit(data, sender, server);
};
