import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import {Player} from "../types/data";
import {PlayerArea} from "@components/organisms/PlayerArea";

const PlayerListContainer = () => {
    const { socket } = useSocketContext()
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
        if (socket) {
            socket.on('player-update', (data: { players: Player[] }) => {
                // 순위에 맞게 정렬
                setPlayers(data.players.sort((a, b) => b.score - a.score))
            })
        }
    }, [])



    return (
        <div>
            <PlayerArea>
                {
                    players
                        .map((player, index) =>
                            <PlayerArea.Card key={player.username} username={player.username} score={player.score} rank={index + 1}/>
                        )
                }
            </PlayerArea>
        </div>
    )
}

export default PlayerListContainer