const { v4: uuidv4 } = require('uuid');
const Client         = require('./Client');
const ItemManager    = require('./ItemManager');

class Room {
    /**
     * @const
     * @type {string}
     */
    uuid;

    /**
     * @type {Client[]}
     */
    clients;

    /**
     * 対戦中か
     * @type {boolean}
     */
    isInBattle;

    /**
     * 武器選択をしている人数
     * @type {Number}
     */
    weaponSelector;

    /**
     * @type {ItemManager}
     */
    itemManager;

    /**
     * @type {RoomManager}
     */
    #roomManager;

    constructor() {
        this.uuid           = uuidv4();
        this.clients        = [];
        this.isInBattle     = false;
        this.weaponSelector = 0;
        this.itemManager    = new ItemManager(this);
    }

    /**
     * @return {number}
     */
    get clientCount() {
        return this.clients.length;
    }

    /**
     * RoomManagerインスタンス。依存関係の問題でゲッターとしている。
     * @return {RoomManager}
     */
    get roomManager() {
        if (!this.#roomManager || !Object.keys(this.#roomManager).length) {
            this.#roomManager = require('./RoomManager');
        }

        return this.#roomManager;
    }

    /**
     * 指定のクライアントをルームに追加する
     * @param {Client} client - 追加させるクライアント
     */
    addClient(client) {
        this.clients.push(client);
    }

    /**
     * ルームにクライアントを新規追加する
     * @return {Client} - 新規クライアント
     * @param {RemoteInfo} remoteInfo
     */
    addNewClient(remoteInfo) {
        const newClient = new Client(remoteInfo);
        this.addClient(newClient);

        return newClient;
    }

    /**
     * 指定のクライアントをルームから削除する
     * @param uuid
     * @return {boolean} - 削除できたか
     */
    removeClient(uuid) {
        const tmpClients = this.clients.filter(c => c.uuid !== uuid);

        //
        if (this.clients.length === tmpClients.length) return false;

        this.clients = this.clients.filter(c => c.uuid !== uuid);

        if (this.clientCount === 0) {
            this.roomManager.removeRoomByUuid(this.uuid);
        } else {
            // TODO: ルーム更新ブロードキャスト
        }

        return true;
    }

    /**
     * UUIDからクライアントを取得する
     * @param {string} uuid
     * @return {Client|null} - クライアント
     */
    getClientByUuid(uuid) {
        for (let client of this.clients) {
            if (client.uuid !== uuid) continue;

            return client;
        }

        return null;
    }
}

module.exports = Room;
