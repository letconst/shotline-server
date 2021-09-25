const { v4: uuidv4 } = require('uuid');
const Client         = require('./Client');
const ItemManager    = require('./ItemManager');
const RoundManager   = require('./RoundManager');

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
     * @type {ItemManager}
     */
    itemManager;

    /**
     * @type {RoundManager}
     */
    roundManager;

    /**
     * @type {RoomManager}
     */
    #roomManager;

    constructor() {
        this.uuid         = uuidv4();
        this.clients      = [];
        this.isInBattle   = false;
        this.itemManager  = new ItemManager(this);
        this.roundManager = new RoundManager(this);
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
