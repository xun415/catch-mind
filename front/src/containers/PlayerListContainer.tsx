import {Player} from "../types/data";
import {PlayerSection} from "@components/ui/PlayerSection";

type Props = {
    players: Player[]
}
const PlayerListContainer = ({ players }: Props) => {
    return (
        <PlayerSection>
            {
                players
                    .map((player, index) =>
                        <PlayerSection.Card key={player.username} username={player.username} score={player.score} rank={index + 1}/>
                    )
            }
        </PlayerSection>
    )
}

export default PlayerListContainer