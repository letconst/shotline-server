const RoomManager   = require('../RoomManager');
const { eventType } = require('../definitions/Definitions');

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
     * 指定のルームに参加している全クライアントにデータを送信する
     * @param {Object} data
     * @param {module:dgram.Socket} server
     * @param {Room} room
     */
    static broadcastToRoom(data, server, room) {
        for (let client of room.clients) {
            this.emit(data, client.remoteInfo, server);
        }
    }

    /**
     * 指定のUUIDルームに参加している全クライアントにデータを送信する
     * @param {Object} data
     * @param {module:dgram.Socket} server
     * @param {string} roomUuid
     */
    static broadcastToRoomByUuid(data, server, roomUuid) {
        const room = RoomManager.getRoomByUuid(roomUuid);

        if (!room) {
            console.warn(`Broadcast: Room ${roomUuid} not found`);
            return;
        }

        this.broadcastToRoom(data, server, room);
    }

    /**
     * 指定のルームの自分 (sender) 以外の全クライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo} sender 自身のクライアント
     * @param {module:dgram.Socket} server
     * @param {Room} room
     */
    static broadcastExceptSelfToRoom(data, sender, server, room) {
        for (let client of room.clients) {
            const {address: cAddress, port: cPort} = client.remoteInfo;
            const {address: sAddress, port: sPort} = sender;

            if (cAddress === sAddress && cPort === sPort) continue;

            this.emit(data, client.remoteInfo, server);
        }
    }

    /**
     * 指定のUUIDルームの自分 (sender) 以外の全クライアントにデータを送信する
     * @param {Object} data 送信データ
     * @param {RemoteInfo} sender 自身のクライアント
     * @param {module:dgram.Socket} server
     * @param {string} roomUuid
     */
    static broadcastExceptSelfToRoomByUuid(data, sender, server, roomUuid) {
        const room = RoomManager.getRoomByUuid(roomUuid);

        if (!room) {
            console.warn(`Broadcast: Room ${roomUuid} not found`);
            return;
        }

        this.broadcastExceptSelfToRoom(data, sender, server, room);
    }

    /**
     * 指定のクライアントにエラーデータを送信する
     * @param {RemoteInfo} sender
     * @param {module:dgram.Socket} server
     * @param {string} message
     */
    static emitError(sender, server, message) {
        const req = {
            Type   : eventType.Error,
            Message: message
        };

        this.emit(req, sender, server);
    }
}

module.exports = NetworkHandler;
