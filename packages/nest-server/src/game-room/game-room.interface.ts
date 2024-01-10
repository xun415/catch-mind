import {User} from "../user/user.interface";

export interface Player extends User {
    // 점수
    score: number
    // 진행한 라운드 수
    playedRound: number
}

export interface GameSession {
    // 현 라운드
    round: number
    // 정답
    answer: string
    // 시작 시간
    startAt: string
    // 종료 시간
    endAt: string | null
    // 현재 진행중인 플레이어
    drawPlayer: Player
}

export interface RoomConfig {
    // 총 라운드
    totalRound: number
    // 참여가능한 최대 플레이어 수
    maxPlayerNumber: number
    // 라운드 당 시간
    timePerRound: number
}

export interface GameRoom extends RoomConfig{
    // 룸 아이디
    id: string
    // 소속 유저 리스트
    players: Player[]
    // 현재 라운드
    currentRound: number
    // 현재 라운드 진행중인 플레이어
    drawPlayer: Player
    // 게임 세션 목록
    sessions: GameSession[]
}
