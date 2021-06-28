const NetworkHandler = require('../utils/NetworkHandler');

/**
 * 切断時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    for (const uuid in clients) {
        if (uuid !== data.Self.Uuid) continue;

        if (clients.hasOwnProperty(uuid)) {
            delete clients[uuid];
        } else {
            console.error(`UUID "${uuid}" isn't exist in connected clients`);
        }

        data.Type       = eventType.Refresh;
        data.Rival.Uuid = uuid;

        NetworkHandler.broadcast(data, clients, server);

        break;
    }
}
