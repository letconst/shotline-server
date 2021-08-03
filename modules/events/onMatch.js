const NetworkHandler = require('../utils/NetworkHandler');

/**
 * マッチング時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    // UUIDがなければ弾く
    if (!data.Uuid) {
        console.error(`${sender.address}:${sender.port} has no UUID`);

        NetworkHandler.emitError(sender, server, 'UUIDが設定されていません');

        return;
    }

    // 対戦相手が待機していれば情報を送信
    for (const uuid in clients) {
        if (data.Uuid === uuid) continue;

        data.Uuid = uuid;

        NetworkHandler.broadcastExceptSelf(data, clients[uuid], server, clients);

        // ホスト側にも通知
        data.IsOwner = true;

        NetworkHandler.emit(data, clients[uuid], server);

        break;
    }

    console.info(`${sender.address}:${sender.port} (${data.Uuid}) joined the room`);
};