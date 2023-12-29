import {Player} from "../types/data";
import {PlayerArea} from "@components/ui/PlayerArea";
import {Box} from "@chakra-ui/react";

type Props = {
    players: Player[]
}
const PlayerListContainer = ({ players }: Props) => {
    return (
        <PlayerArea>
            {
                players
                    .map((player, index) =>
                        <PlayerArea.Card key={player.username} username={player.username} score={player.score} rank={index + 1}/>
                    )
            }
        </PlayerArea>
    )
}

export default PlayerListContainer