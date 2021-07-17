const NetworkHandler = require('../utils/NetworkHandler');

/**
 * マッチング時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
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