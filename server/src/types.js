/**
 * @typedef User
 * @property {string} username 유저명
 * @property {string} id 서버 부여 랜덤 아이디
 * @property {string} socketId 소켓 아이디
 * @property {string} roomId 룸 아이디
 */

/**
 * @typedef Room
 * @property {string} id 룸 아이디
 * @property {User[]} connectedUsers 소속 유저 리스트
 */