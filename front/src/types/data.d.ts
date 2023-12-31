import {E_GAME_STATUS} from "../constant/game";

export type User = {
    username: string
    id: string
    socketId: string
    roomId: string
}

export type Player = User & {
    score: number
    playedRound: number
}

export type RoomConfig = {
    //  총 라운드
    totalRound: number
    // 참여가능한 최대 플레이어 수
    maxPlayerNumber: number
    //  라운드 당 시간
    timePerRound: number
}

export type Room = {
    // 룸 아이디
    id: string | null
    // 룸 설정
    roomConfig: RoomConfig
    //  소속 유저 리스트
    players: Player[]
    // 현재 라운드
    currentRound: number
    // 현재 라운드 진행중인 플레이어
    drawPlayer: Player | null
    // 게임 상태
    gameStatus: E_GAME_STATUS
    // 정답
    currentAnswer: string | null
    // 정답 길이
    currentAnswerLength: number | null
}

export type Message = {
    type: 'guess' | 'notice',
    content: string,
    senderName?: string
}