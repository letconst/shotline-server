const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

require('../utils/initializer').dotenv();
const { MAX_CONNECTIONS } = process.env;

/**
 * 部屋への参加時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const { RoomUuid, ClientUuid } = data;

    const room = RoomManager.getRoomByUuid(RoomUuid);

    // readyフラグ設定
    const client       = room.clients.find(c => ClientUuid === c.uuid);
    client.isRoomReady = true;

    // ステージに遷移済みのプレイヤーをカウント
    const joinedCount = room.clients.filter(c => c.isRoomReady).length;

    // 全プレイヤーが遷移してたらゲーム開始
    if (joinedCount === Number(MAX_CONNECTIONS)) {
        data.ClientUuid = '';
        NetworkHandler.broadcastToRoom(data, server, room);
    }
};
