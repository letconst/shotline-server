const NetworkHandler = require('../utils/NetworkHandler');

require('../utils/initializer')();
const { MAX_CONNECTIONS } = process.env;

/**
 * マッチング時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    // 満員なら弾く (暫定)
    if (clients.length >= MAX_CONNECTIONS) {
        data.Type    = eventType.Error;
        data.Message = 'サーバーは満員です';

        NetworkHandler.emit(data, sender, server);

        return;
    }

    // UUIDがなければ弾く
    if (!data.Self.Uuid) {
        console.error(`${sender.address}:${sender.port} has no UUID`);

        data.Type    = eventType.Error;
        data.Message = 'UUIDが設定されていません';

        NetworkHandler.emit(data, sender, server);

        return;
    }

    // 対戦相手が待機していれば情報を送信
    for (const uuid in clients) {
        if (data.Self.Uuid === uuid) continue;

        data.Rival.Address = clients[uuid].address;
        data.Rival.Port    = clients[uuid].port;
        data.Rival.Uuid    = uuid;

        NetworkHandler.broadcast(data, clients, server);
    }

    console.log(`${sender.address}:${sender.port} (${data.Self.Uuid}) joined the room`);
}