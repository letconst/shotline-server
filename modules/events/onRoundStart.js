const RoomManager = require('../RoomManager');

/**
 * ラウンド開始時の処理
 * @param {Object} data
 * @param __
 * @param ___
 */
module.exports = (data, __, ___) => {
    const room = RoomManager.getRoomByUuid(data.RoomUuid);
    room.itemManager.startGenerate();
    room.roundManager.startSuddenDeathCount();

    console.info('Round started');
};
