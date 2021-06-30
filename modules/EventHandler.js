const NetworkHandler = require('./utils/NetworkHandler');

// TODO: 非global化
global.eventType = {
    Init      : 'Init',
    Match     : 'Match',
    Joined    : 'Joined',
    PlayerMove: 'PlayerMove',
    BulletMove: 'BulletMove',
    Disconnect: 'Disconnect',
    Refresh   : 'Refresh',
    Error     : 'Error'
}

const events = {
    onInit      : require('./events/onInit'),
    onMatch     : require('./events/onMatch'),
    onJoined    : require('./events/onJoined'),
    onPlayerMove: require('./events/onPlayerMove'),
    onBulletMove: require('./events/onBulletMove'),
    onDisconnect: require('./events/onDisconnect')
}

class EventHandler {
    /**
     * @type {module:dgram.Socket}
     */
    #server;

    /**
     *
     * @param {module:dgram.Socket} server
     */
    constructor(server) {
        this.#server = server;
    }

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

            NetworkHandler.emitError(data, sender, this.#server, 'イベントタイプが指定されていません');

            return;
        }

        const eventKey = `on${data.Type}`;

        // イベント処理があれば実行
        if (events.hasOwnProperty(eventKey)) {
            events[eventKey](data, sender, this.#server);
        } else {
            console.error(`${data.type} is unknown type`);

            NetworkHandler.emitError(data, sender, this.#server, `イベントタイプ「${data.type}」は存在しないか、処理が割り当てられていません`);
        }
    }
}

module.exports = EventHandler;
