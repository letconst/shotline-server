const NetworkHandler = require('../utils/NetworkHandler');

/**
 * アイテム破棄時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    NetworkHandler.broadcastExceptSelfToRoomByUuid(data, sender, server, data.RoomUuid);
};
