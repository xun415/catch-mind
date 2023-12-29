import {Player, Room, RoomConfig} from "../types/data";
import {create} from "zustand";
import {devtools} from "zustand/middleware";
import {E_GAME_STATUS, GAME_STATUS} from "../constant/game";

type UseGameRoomStore = Room & {
    setRoomConfig: (newConfig: RoomConfig) => void
    setId: (id: string) => void
    setCurrentRound: (v: number) => void
    setDrawPlayer: (player: Player) => void
    setPlayers: (players: Player[]) => void
    setGameStatus: (status: E_GAME_STATUS) => void
    setCurrentAnswer: (answer: string) => void
    setCurrentAnswerLength: (answerLength: number) => void
}

const initStatus: Room = {
    id: null,
    players: [],
    // default
    totalRound: 3,
    maxPlayerNumber: 4,
    timePerRound: 180,
    currentRound: 0,
    drawPlayer: null,
    gameStatus: GAME_STATUS.설정중,
    currentAnswer: null,
    currentAnswerLength: null
}

export const useGameRoomStore = create<UseGameRoomStore>()(
    devtools(
        set => ({
            ...initStatus,
            setRoomConfig: (newConfig: RoomConfig) => {
                set(prev => ({
                    ...prev,
                   ...newConfig
                }))
            },
            setId: (id: string) => {
                set(prev => ({
                    ...prev,
                    id
                }))
            },
            setCurrentRound: (currentRound: number) => {
                set(prev => ({
                    ...prev,
                    currentRound
                }))
            },
            setDrawPlayer: (drawPlayer) => {
                console.log('[store] setDrawPlayer')
                set(prev => ({
                    ...prev,
                    drawPlayer
                }))
            },
            setPlayers: (players) => {
                set(prev => ({
                    ...prev,
                    players
                }))
            },
            setGameStatus: (gameStatus) => {
                set(prev => ({
                    ...prev,
                    gameStatus
                }))
            },
            setCurrentAnswer: (currentAnswer) => {
                set(prev => ({
                    ...prev,
                    currentAnswer
                }))
            },
            setCurrentAnswerLength: (currentAnswerLength) => {
                set(prev => ({
                    ...prev,
                    currentAnswerLength
                }))
            }
        })
    )
)