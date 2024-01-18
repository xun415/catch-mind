import {Stack, Text} from "@chakra-ui/react";
import {ReactNode} from "react";
import {COLOR} from "@assets/styles/color.css";

type Props = {
    children: ReactNode | ReactNode[]
}

const Root = ({ children }: Props) => {
    return (
        <Stack as={'section'} spacing={4} p={4} border={`2px solid ${COLOR.lightGray}`} borderRadius={'xl'}>
            <Text as={'h3'} fontSize={'x-large'} fontWeight={600}>User List</Text>
            {children}
        </Stack>
    )
}

export default Root