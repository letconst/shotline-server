const NetworkHandler = require('../utils/NetworkHandler');
const RoomManager    = require('../RoomManager');

require('../utils/initializer').dotenv();
const { MAX_CONNECTIONS } = process.env;

/**
 * ルーム参加通知（武器選択開始）時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = async (data, sender, server) => {
    const room = RoomManager.getRoomByUuid(data.RoomUuid);

    if (!room) return;

    // 選択完了フラグ設定
    const client            = room.clients.find(c => data.ClientUuid === c.uuid);
    client.isSelectedWeapon = true;

    await new Promise((resolve) => setTimeout(resolve, 1000));

    const selectedClients = room.clients.filter(c => c.isSelectedWeapon).length;

    // 全員選択中なら通知
    if (selectedClients === Number(MAX_CONNECTIONS)) {
        NetworkHandler.broadcastToRoomByUuid(data, server, data.RoomUuid);
    }
};
