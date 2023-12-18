import {Player} from "../types/data";
import {PlayerArea} from "@components/organisms/PlayerArea";
import {Box} from "@chakra-ui/react";

type Props = {
    players: Player[]
}
const PlayerListContainer = ({ players }: Props) => {
    const ps = [
        {
            username: 'ddd',
            id: 's',
            socketId: 'sdf',
            roomId: 'sdf',
            score: 123,
            playedRound: 1
        },
        {
            username: 'ddds',
            id: 'sa',
            socketId: 'sdfs',
            roomId: 'sdfs',
            score: 1231,
            playedRound: 12
        }
    ]



    return (
        <Box borderRadius={'1px solid black'}>
            dd
            <PlayerArea>
                {
                    ps
                        .map((player, index) =>
                            <PlayerArea.Card key={player.username} username={player.username} score={player.score} rank={index + 1}/>
                        )
                }
            </PlayerArea>
        </Box>
    )
}

export default PlayerListContainer