const NetworkHandler = require('./utils/NetworkHandler');
const Room           = require('./Room');

const roomUpdateType = {
    create: 0,
    update: 1,
    delete: 2
};

/**
 * 稼働ルームの最小数
 * 起動時はこの数のルームが生成され、総ルーム数がこれ未満になることはない
 * @type {number}
 */
const MIN_ROOM_COUNT = 2;

class RoomManager {
    /**
     *
     * @type {Room[]}
     */
    #rooms = [];

    constructor() {
        for (let i = 0; i < MIN_ROOM_COUNT; i++) {
            this.createRoom();
        }
    }

    get allRooms() {
        return this.#rooms;
    }

    /**
     * ルームを作成する
     * @return {Room} - 作成したルーム
     */
    createRoom() {
        const newRoom = new Room();
        this.#rooms.push(newRoom);

        return newRoom;
    }

    /**
     * 指定のUUIDのルームを破棄する
     * @param {string} uuid
     */
    removeRoomByUuid(uuid) {
        const tmpRooms = this.#rooms.filter(r => r.uuid !== uuid);

        // 一致するUUIDのルームがなければ終了
        if (this.#rooms.length === tmpRooms.length) return;

        // 現在のルーム数が最小数なら不足となる分を作成
        if (this.#rooms.length === MIN_ROOM_COUNT) {
            tmpRooms.push(new Room());
        }

        this.#rooms = tmpRooms;

        console.info(`Room (${uuid}) is removed`);
    }

    /**
     * UUIDからルームを取得する
     * @param uuid
     * @return {Room|null}
     */
    getRoomByUuid(uuid) {
        const room = this.#rooms.find(r => r.uuid === uuid);

        return room || null;
    }

    /**
     * 指定のクライアントが参加しているルームを取得する
     * クライアントの参加ルームがなければnullが返る
     * @param {string} clientUuid
     * @return {Room|null}
     */
    getRoomByClient(clientUuid) {
        const joiningRoom = this.#rooms.find(r => r.getClientByUuid(clientUuid) !== null);

        return joiningRoom || null;
    }

    /**
     * 指定のルームにクライアントを参加させる
     * ルームが存在しなければnullが返る
     * @param {string} roomUuid
     * @param {RemoteInfo} remoteInfo
     * @return {Client|null}
     */
    joinClientToRoom(roomUuid, remoteInfo) {
        const targetRoom = this.#rooms.find(r => r.uuid === roomUuid);

        // 指定のルームがなければnullを返す
        if (!targetRoom) return null;

        return targetRoom.addNewClient(remoteInfo);
    }

    /**
     * 指定のクライアントを参加しているルームから削除する
     * @param {string} clientUuid
     * @return {boolean} - 削除できたか
     */
    removeClientFromRoom(clientUuid) {
        const joiningRoom = this.getRoomByClient(clientUuid);

        // 参加ルームがなければ終了
        if (!joiningRoom) return false;

        return joiningRoom.removeClient(clientUuid);
    }

    #broadcastRemoveRoom(roomUuid) {
        // TODO
    }
}

module.exports = new RoomManager();
