import {Card, CardBody, CardHeader, Heading, Text} from "@chakra-ui/react";

type Props = {
    username: string
    score: number
    rank: number
}
const PlayerCard = ({ username, score, rank }: Props) => {

    return (
        <Card variant={'elevated'}>
            <CardHeader>
                <Heading size='md'>{rank} {username}</Heading>
            </CardHeader>
            <CardBody>
                <Text>Score: {score}</Text>
            </CardBody>
        </Card>
    )
}

export default PlayerCard