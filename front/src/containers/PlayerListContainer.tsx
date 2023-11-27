import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import {Player} from "../types";

const PlayerListContainer = () => {
    /**
     * todo
     * - 유저 리스트 보여주기 (목록, 점수, 진행중 등)
     */
    const { socket } = useSocketContext()
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        if (socket) {
            socket.on('player-update', (data: { players: Player[] }) => {
                console.log('data: ', data.players)
                setPlayers(data.players)
            })
        }
    }, [])

    return (
        <div>
            {players.toString()}
        </div>
    )
}

export default PlayerListContainer