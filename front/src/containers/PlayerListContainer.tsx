import {useSocketContext} from "@contexts/socket";
import {useEffect, useState} from "react";
import {Player} from "../types/data";
import {PlayerArea} from "@components/organisms/PlayerArea";

type Props = {
    players: Player[]
}
const PlayerListContainer = ({ players }: Props) => {




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