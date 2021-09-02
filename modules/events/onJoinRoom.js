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
    const room = RoomManager.getRoomByUuid(data.RoomUuid);

    data.IsJoinable = false;
    console.log(room);

    if (room) {
        if (room.clientCount < Number(MAX_CONNECTIONS)) {
            data.IsJoinable = true;
            data.Client     = RoomManager.joinClientToRoom(room.uuid);
        } else {
            data.Message = 'ルームが満員です';
        }
    } else {
        data.Message = 'ルームが存在しません';
    }

    NetworkHandler.emit(data, sender, server);
};
