const NetworkHandler = require('../utils/NetworkHandler');

require('../utils/initializer').dotenv();
const { MAX_CONNECTIONS } = process.env;

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
    if (joinedCount === Number(MAX_CONNECTIONS)) {
        NetworkHandler.broadcast(data, clients, server);
    }
};
