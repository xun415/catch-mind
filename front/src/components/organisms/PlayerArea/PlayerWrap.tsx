import {Flex, Stack} from "@chakra-ui/react";
import {ReactNode} from "react";

type Props = {
    children: ReactNode | ReactNode[]
}

const PlayerWrap = ({ children }: Props) => {
    return (
        <Stack spacing={4}>
            {children}
        </Stack>
    )
}

export default PlayerWrap