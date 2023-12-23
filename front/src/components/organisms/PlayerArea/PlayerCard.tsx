import {Card, CardBody, CardHeader, Heading, Text} from "@chakra-ui/react";

type Props = {
    username: string
    score: number
    rank: number
}
const PlayerCard = ({ username, score, rank }: Props) => {

    return (
        <Card variant={'elevated'} p={{ base: 2, md: 4}}>
            <CardHeader p={0}>
                <Heading size='md'>{rank} {username}</Heading>
            </CardHeader>
            <CardBody p={0}>
                <Text>Score: {score}</Text>
            </CardBody>
        </Card>
    )
}

export default PlayerCard