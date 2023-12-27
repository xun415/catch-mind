import {Player, Room, RoomConfig} from "../types/data";
import {create} from "zustand";
import {devtools} from "zustand/middleware";

type UseGameRoomStore = Room & {
    setRoomConfig: (newConfig: RoomConfig) => void
    setId: (id: string) => void
    setCurrentRound: (v: number) => void
    setDrawPlayer: (player: Player) => void
    setPlayers: (players: Player[]) => void
}

const initStatus: Room = {
    id: null,
    players: [],
    // default
    totalRound: 3,
    maxPlayerNumber: 4,
    timePerRound: 180,
    currentRound: 0,
    drawPlayer: null
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
                console.log('store setdrawPlayer', drawPlayer)
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
            }
        })
    )
)