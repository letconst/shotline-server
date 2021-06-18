const { v4: uuidv4 } = require('uuid');
const NetworkHandler = require('./utils/NetworkHandler');

require('./utils/initializer')();
const { MAX_CONNECTIONS } = process.env;

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

        if (!data.type) {
            console.error('Data has no Type');

            data.type     = 'error';
            data.errorMsg = 'イベントタイプが指定されていません';

            this.networkHandler.emit(data, sender);

            return;
        }

        switch (data.type) {
            // 初回接続
            case 'init': {
                const thisPlayerUuid = uuidv4();

                data.type               = 'init';
                data.uuid               = thisPlayerUuid;
                clients[thisPlayerUuid] = sender;

                this.networkHandler.emit(data, sender);

                break;
            }

            // 部屋への参加 (マッチング)
            // TODO: 空きがなければ部屋作成
            case 'join': {
                // 満員なら弾く (暫定)
                if (clients.length >= MAX_CONNECTIONS) {
                    data.type     = 'error';
                    data.errorMsg = '部屋が満員です';

                    this.networkHandler.emit(data, sender);

                    return;
                }

                // UUIDがなければ弾く
                if (!data.uuid) {
                    console.error(`${sender.address}:${sender.port} has no UUID`);

                    data.type     = 'error';
                    data.errorMsg = 'UUIDが設定されていません';

                    this.networkHandler.emit(data, sender);

                    return;
                }

                // 対戦相手情報を送信
                for (const uuid in clients) {
                    data.rival.address = clients[uuid].address;
                    data.rival.port    = clients[uuid].port;
                    data.rival.uuid    = uuid;

                    this.networkHandler.emit(data, sender);
                }

                console.log(`${sender.address}:${sender.port} (${data.uuid}) joined the room`);

                break;
            }

            // 座標更新
            case 'move' : {
                break;
            }

            // 切断
            case 'disconnect': {
                for (const uuid in clients) {
                    if (uuid !== data.uuid) continue;

                    delete clients[uuid];

                    data.type = 'client_reload';
                    data.uuid = uuid;

                    this.networkHandler.broadcast(data, clients);

                    break;
                }

                break;
            }

            default: {
                console.error(`${data.type} is unknown type`);

                data.type     = 'error';
                data.errorMsg = `イベントタイプ「${data.type}」は存在しません`;

                this.networkHandler.emit(data, sender);

                break;
            }
        }
    }
}

module.exports = EventHandler;
