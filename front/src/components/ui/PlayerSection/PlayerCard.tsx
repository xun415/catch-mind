import {Card, CardBody, CardHeader, Heading, Text} from "@chakra-ui/react";
import {COLOR} from "@assets/styles/color.css";

type Props = {
    username: string
    score: number
    rank: number
}
const PlayerCard = ({ username, score, rank }: Props) => {

    return (
        <Card p={2} bg={COLOR.lightGray}>
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