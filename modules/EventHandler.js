const { v4: uuidv4 } = require('uuid');
const NetworkHandler = require('./utils/NetworkHandler');

require('./utils/initializer')();
const { MAX_CONNECTIONS } = process.env;

const eventType = {
    Init      : 'Init',
    Match     : 'Match',
    Move      : 'Move',
    Disconnect: 'Disconnect',
    Refresh   : 'Refresh',
    Error     : 'Error'
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
        this.#server        = server;
        this.networkHandler = new NetworkHandler(this.#server);
    }

    /**
     * 受信データの種類ごとに処理をする
     * @param {string} msg 受信データ
     * @param {RemoteInfo} sender 受信クライアント
     * @param {RemoteInfo[]} clients 送信先のクライアント
     */
    switchMessage(msg, sender, clients) {
        const data = JSON.parse(msg);

        if (!data.Type) {
            console.error('Data has no Type');

            data.Type    = eventType.Error;
            data.Message = 'イベントタイプが指定されていません';

            this.networkHandler.emit(data, sender);

            return;
        }

        switch (data.Type) {
            // 初回接続
            case eventType.Init: {
                const thisPlayerUuid = uuidv4();

                data.Self.Uuid          = thisPlayerUuid;
                clients[thisPlayerUuid] = sender;

                this.networkHandler.emit(data, sender);

                break;
            }

            // 部屋への参加 (マッチング)
            // TODO: 空きがなければ部屋作成
            case eventType.Match: {
                // 満員なら弾く (暫定)
                if (clients.length >= MAX_CONNECTIONS) {
                    data.Type    = eventType.Error;
                    data.Message = '部屋が満員です';

                    this.networkHandler.emit(data, sender);

                    return;
                }

                // UUIDがなければ弾く
                if (!data.Self.Uuid) {
                    console.error(`${sender.address}:${sender.port} has no UUID`);

                    data.Type    = eventType.Error;
                    data.Message = 'UUIDが設定されていません';

                    this.networkHandler.emit(data, sender);

                    return;
                }

                // 対戦相手情報を送信
                for (const uuid in clients) {
                    data.Rival.Address = clients[uuid].address;
                    data.Rival.Port    = clients[uuid].port;
                    data.Rival.Uuid    = uuid;

                    this.networkHandler.emit(data, sender);
                }

                console.log(`${sender.address}:${sender.port} (${data.uuid}) joined the room`);

                break;
            }

            // 座標更新
            case eventType.Move : {
                break;
            }

            // 切断
            case eventType.Disconnect: {
                for (const uuid in clients) {
                    if (uuid !== data.Self.Uuid) continue;

                    delete clients[uuid];

                    data.Type       = eventType.Refresh;
                    data.Rival.Uuid = uuid;

                    this.networkHandler.broadcast(data, clients);

                    break;
                }

                break;
            }

            default: {
                console.error(`${data.type} is unknown type`);

                data.Type    = eventType.Error;
                data.Message = `イベントタイプ「${data.type}」は存在しません`;

                this.networkHandler.emit(data, sender);

                break;
            }
        }
    }
}

module.exports = EventHandler;
