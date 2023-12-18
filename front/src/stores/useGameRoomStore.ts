import {Room} from "../types";
import {create} from "zustand";
import {devtools} from "zustand/middleware";

type UseGameRoomStore = Room

type RoomConfig = Pick<Room, 'totalRound' | 'maxPlayerNumber' | 'timePerRound' | 'isSettingCompleted'>

const initStatus: Room = {
    id: null,
    players: [],
    // default
    totalRound: 3,
    maxPlayerNumber: 4,
    timePerRound: 180,
    isSettingCompleted: false,
    currentRound: 0,
    currentPlayer: null
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

        })
    )
)