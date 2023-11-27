/**
 * @typedef User
 * @property {string} username 유저명
 * @property {string} id 서버 부여 랜덤 아이디
 * @property {string} socketId 소켓 아이디
 * @property {string} roomId 룸 아이디
 */

/**
 * @typedef Player
 * @extends User
 *
 * @property {number} score 점수
 * @property {number} playedRound 진행한 라운드 수
 */

/**
 * @typedef Room
 *
 * @property {string} id 룸 아이디
 * @property {Player[]} players 소속 유저 리스트
 * @property {number} totalRound 총 라운드
 * @property {number} maxPlayerNumber 참여가능한 최대 플레이어 수
 * @property {number} timePerRound 라운드 당 시간
 * @property {boolean} isSettingCompleted 세팅 완료 여부
 * @property {number} currentRound 현재 라운드
 * @property {string | null} currentPlayer 현재 라운드 진행중인 플레이어
 *
 */