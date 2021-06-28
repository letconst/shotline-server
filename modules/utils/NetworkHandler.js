class NetworkHandler {
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
     * 指定のクライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo} sender 対象のクライアント
     */
    emit(data, sender) {
        const msg = JSON.stringify(data);

        this.#server.send(msg, sender.port, sender.address);
        console.log(`Message sent to ${sender.address}:${sender.port}`);
    }

    /**
     * 全クライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo[]} clients 送信先のクライアント
     */
    broadcast(data, clients) {
        for (const client in clients) {
            this.emit(data, clients[client]);
        }
    }

    /**
     * 自分 (sender) 以外の全クライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo} sender 自身のクライアント
     * @param {RemoteInfo[]} clients 送信祭のクライアント
     */
    broadcastExceptSelf(data, sender, clients) {
        const msg = JSON.stringify(data);

        for (const client of clients) {
            if (client.address === sender.address) continue;

            this.emit(msg, client);
        }
    }
}

module.exports = NetworkHandler;
