const { v4: uuidv4 } = require('uuid');
const NetworkHandler = require('../utils/NetworkHandler');

require('../utils/initializer').dotenv();
const { MAX_CONNECTIONS } = process.env;

/**
 * 初回接続時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    // 満員なら弾く (暫定)
    if (clients.length >= Number(MAX_CONNECTIONS)) {
        NetworkHandler.emitError(sender, server, 'サーバーは満員です');

        return;
    }

    const thisPlayerUuid = uuidv4();

    data.Uuid               = thisPlayerUuid;
    clients[thisPlayerUuid] = sender;

    // 配列のプロパティとして追加しているため、長さを手動で++（暫定）
    clients.length++;

    NetworkHandler.emit(data, sender, server);
};