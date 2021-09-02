const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

/**
 * 全ルーム取得時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    data['Rooms'] = RoomManager.allRooms;

    NetworkHandler.emit(data, sender, server);
};
