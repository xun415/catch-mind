import Header from "@components/organisms/Header";
import { Outlet } from 'react-router-dom'
import {Center, Container} from "@chakra-ui/react";

const GameLayout = () => {
    return (
        <>
            <Header/>
            <main>
                <Center>
                    <Container p={'20px'} maxW={'1480px'}>
                        <Outlet />
                    </Container>
                </Center>
            </main>
        </>
    )
}

export default GameLayout