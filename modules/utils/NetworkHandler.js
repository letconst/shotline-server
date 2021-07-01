class NetworkHandler {
    /**
     * 指定のクライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo} sender 対象のクライアント
     * @param {module:dgram.Socket} server
     */
    static emit(data, sender, server) {
        const msg = JSON.stringify(data);

        server.send(msg, sender.port, sender.address);
        // console.log(`Message sent to ${sender.address}:${sender.port}`);
    }

    /**
     * 全クライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo[]} clients 送信先のクライアント
     * @param {module:dgram.Socket} server
     */
    static broadcast(data, clients, server) {
        for (const client in clients) {
            this.emit(data, clients[client], server);
        }
    }

    /**
     * 自分 (sender) 以外の全クライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo} sender 自身のクライアント
     * @param {module:dgram.Socket} server
     * @param {RemoteInfo[]} clients 送信祭のクライアント
     */
    static broadcastExceptSelf(data, sender, server, clients) {
        for (const uuid in clients) {
            if (clients[uuid].address === sender.address &&
                clients[uuid].port === sender.port) continue;

            this.emit(data, clients[uuid], server);
        }
    }

    /**
     * 指定のクライアントにエラーデータを送信する
     * @param {Object} data
     * @param {RemoteInfo} sender
     * @param {module:dgram.Socket} server
     * @param {string} message
     */
    static emitError(data, sender, server, message) {
        data.Type    = eventType.Error;
        data.Message = message;

        this.emit(data, sender, server);
    }
}

module.exports = NetworkHandler;
