const RoomManager    = require('../RoomManager');
const networkHandler = require('../utils/NetworkHandler');
const eventType      = require('../definitions/eventType');

/**
 * ルーム作成リクエストの処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const room = RoomManager.createRoom();

    const res = {
        Type      : eventType.JoinRoom,
        RoomUuid  : room.uuid,
        IsJoinable: true,
        Client    : RoomManager.joinClientToRoom(room.uuid, sender),
        IsOwner   : true
    };

    networkHandler.emit(res, sender, server);
};
