import {Box, Button, Center, Container, Flex, Text} from "@chakra-ui/react";
import {copyText} from "../../../utils/browser/clipboard";
import {useGameRoomStore} from "../../../stores/useGameRoomStore";
import {ReactNode} from "react";

const Header = () => {
    const { id } = useGameRoomStore()
    const onClickCopyRoomId = () => {
        // copy to clipboard
        id? copyText(id, () => {
            alert('방 아이디가 복사되었습니다.')
        }, () => {
            alert(`지원하지 않는 브라우저 입니다. 다음 아이디를 복사해주세요. \n ${id}`)
        }) : undefined

    }

    return (
        <header css={{ borderBottom: '1px solid gray' }}>
            <Container p={'20px'} maxW={'1480px'}>
                <Flex justifyContent={'space-between'} alignItems={'center'}>
                    <Text as={'h1'} fontWeight={800} fontSize={'xx-large'}>CATCH MIND</Text>
                    {
                        id ? <Button colorScheme={'blue'} onClick={onClickCopyRoomId}>초대하기</Button> as ReactNode : null
                    }
                </Flex>
            </Container>
        </header>
    )
}

export default Header