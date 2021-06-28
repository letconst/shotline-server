const NetworkHandler = require('../utils/NetworkHandler');

/**
 * プレイヤー移動時の処理
 * @param {Object} data
 * @param {RemoteInfo} sender
 * @param {module:dgram.Socket} server
 */
module.exports = (data, sender, server) => {
    const tmpPos = data.Self.Position;
    const tmpRot = data.Self.Rotation;

    data.Rival.Position = tmpPos;
    data.Rival.Rotation = tmpRot;
    data.Self.Position  = null;
    data.Self.Rotation  = null;

    NetworkHandler.broadcastExceptSelf(data, sender, server, clients);
}
