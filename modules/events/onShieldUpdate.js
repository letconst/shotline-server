const NetworkHandler = require('../utils/NetworkHandler');

/**
 * アイテム生成時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    data.ClientUuid = '';
    NetworkHandler.broadcastExceptSelfToRoomByUuid(data, sender, server, data.RoomUuid);
};
