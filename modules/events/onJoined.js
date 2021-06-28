const EventHandler   = require('../EventHandler');
const NetworkHandler = require('../utils/NetworkHandler');

/**
 * 部屋への参加時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    let joinedCount = 0;

    for (const uuid in clients) {
        if (data.Self.Uuid !== uuid) continue;

        clients[uuid].isJoined = true;

        break;
    }

    // ステージに遷移済みのプレイヤーをカウント
    for (const uuid in clients) {
        if (clients[uuid].isJoined) joinedCount++;
    }

    // 全プレイヤーが遷移してたらゲーム開始
    if (joinedCount === 2) {
        NetworkHandler.broadcast(data, clients, server);
    }
}
