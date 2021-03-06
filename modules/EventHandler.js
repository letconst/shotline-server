const NetworkHandler = require('./utils/NetworkHandler');
const RoomManager    = require('./RoomManager');
const { server }     = require('../index');

const events = {
    onInit          : require('./events/onInit'),
    onCreateRoom    : require('./events/onCreateRoom'),
    onGetAllRoom    : require('./events/onGetAllRoom'),
    onJoinRoom      : require('./events/onJoinRoom'),
    onExitRoom      : require('./events/onExitRoom'),
    onEnterRoom     : require('./events/onEnterRoom'),
    onWeaponSelected: require('./events/onWeaponSelected'),
    onMatch         : require('./events/onMatch'),
    onJoined        : require('./events/onJoined'),
    onPlayerMove    : require('./events/onPlayerMove'),
    onBulletMove    : require('./events/onBulletMove'),
    onItemInit      : require('./events/onItemInit'),
    onItemGet       : require('./events/onItemGet'),
    onInstantiate   : require('./events/onInstantiate'),
    onDestroy       : require('./events/onDestroy'),
    onShieldUpdate  : require('./events/onShieldUpdate'),
    onRoundStart    : require('./events/onRoundStart'),
    onRoundUpdate   : require('./events/onRoundUpdate'),
    onDisconnect    : require('./events/onDisconnect')
};

class EventHandler {
    /**
     * 受信データの種類ごとに処理をする
     * @param {string} msg 受信データ
     * @param {RemoteInfo} sender 受信クライアント
     */
    switchMessage(msg, sender) {
        const data = JSON.parse(msg);

        // イベントタイプが指定されいない場合はエラー
        if (!data.Type) {
            console.error('Data has no Type');

            NetworkHandler.emitError(sender, server, 'イベントタイプが指定されていません');

            return;
        }

        // ルーム内通信なら最終通信タイムスタンプ更新
        if (data.hasOwnProperty('RoomUuid') && data.RoomUuid) {
            const room = RoomManager.getRoomByUuid(data.RoomUuid);

            if (!room) {
                NetworkHandler.emitError(sender, server, 'このルームは存在しません。');
            } else {
                room.updateLastRequestTimestamp();
            }
        }

        const eventKey = `on${data.Type}`;

        // イベント処理があれば実行
        if (events.hasOwnProperty(eventKey)) {
            events[eventKey](data, sender, server);
        } else {
            console.error(`${data.type} is unknown type`);

            NetworkHandler.emitError(sender, server, `イベントタイプ「${data.Type}」は存在しないか、処理が割り当てられていません`);
        }
    }
}

module.exports = new EventHandler();
