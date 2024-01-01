import {Player} from "../../../types/data";
import {Button, Heading, ListItem, OrderedList, VStack} from "@chakra-ui/react";
import {ReactNode} from "react";

type Props = {
    players: Player[]
    onClickLeave: () => void
}

const GameResult = ({ players, onClickLeave }: Props) => {
    const rankedPlayers = players.sort((a, b) => b.score - a.score)
    return (
        <VStack gap={4}>
            <Heading as={'h3'}>게임 결과</Heading>
            <OrderedList>
                {
                    rankedPlayers.map((player) => (
                        <ListItem key={`player-rank-${player.id}`}>
                            {player.username}: {player.score} 점
                        </ListItem>
                    )) as ReactNode
                }
            </OrderedList>
            <Button colorScheme={'red'} onClick={onClickLeave}>나가기</Button>
        </VStack>
    )
}

export default GameResult