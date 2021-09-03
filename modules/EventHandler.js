const NetworkHandler = require('./utils/NetworkHandler');
const { server }     = require('../index');

// TODO: 非global化
global.eventType = {
    Init        : 'Init',
    Match       : 'Match',
    Joined      : 'Joined',
    PlayerMove  : 'PlayerMove',
    BulletMove  : 'BulletMove',
    ItemInit    : 'ItemInit',
    ItemGenerate: 'ItemGenerate',
    ItemGet     : 'ItemGet',
    Instantiate : 'Instantiate',
    Destroy     : 'Destroy',
    ShieldUpdate: 'ShieldUpdate',
    RoundStart  : 'RoundStart',
    RoundUpdate : 'RoundUpdate',
    Disconnect  : 'Disconnect',
    Refresh     : 'Refresh',
    Error       : 'Error'
};

const events = {
    onInit        : require('./events/onInit'),
    onMatch       : require('./events/onMatch'),
    onJoined      : require('./events/onJoined'),
    onPlayerMove  : require('./events/onPlayerMove'),
    onBulletMove  : require('./events/onBulletMove'),
    onItemInit    : require('./events/onItemInit'),
    onItemGet     : require('./events/onItemGet'),
    onInstantiate : require('./events/onInstantiate'),
    onDestroy     : require('./events/onDestroy'),
    onShieldUpdate: require('./events/onShieldUpdate'),
    onRoundStart  : require('./events/onRoundStart'),
    onRoundUpdate : require('./events/onRoundUpdate'),
    onDisconnect  : require('./events/onDisconnect')
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
