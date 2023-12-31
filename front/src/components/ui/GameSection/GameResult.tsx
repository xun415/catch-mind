import {Player} from "../../../types/data";

type Props = {
    players: Player[]
}

const GameResult = ({ players }: Props) => {

    return <div>
        {
            players.map((player) => (
                <div key={player.id}>
                    {player.username}: {player.score}
                </div>
            ))
        }
    </div>
}

export default GameResult