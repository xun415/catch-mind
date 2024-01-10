export interface User {
    // 유저명
    username: string
    // 서버 부여 랜덤 아이디
    id: string
    // 소켓 아이디
    socketId: string
    // 아이디
    roomId: string
    // 호스트여부
    isHost: boolean
}
