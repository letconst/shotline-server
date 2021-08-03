const NetworkHandler = require('../utils/NetworkHandler');
const ItemManager    = require('../ItemManager');

/**
 * 切断時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    for (const uuid in clients) {
        if (uuid !== data.Uuid) continue;

        if (clients.hasOwnProperty(uuid)) {
            delete clients[uuid];
            clients.length--;
            console.info(`${sender.address}:${sender.port} is disconnected`);
        } else {
            console.error(`UUID "${uuid}" isn't exist in connected clients`);
        }

        if (clients.length === 0) {
            ItemManager.reset();
        }

        const newReq = {
            Type     : eventType.Refresh,
            RivalUuid: uuid
        };

        NetworkHandler.broadcast(newReq, clients, server);

        break;
    }
};
