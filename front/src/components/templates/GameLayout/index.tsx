import Header from "@components/ui/Header";
import { Outlet } from 'react-router-dom'
import {Container} from "@chakra-ui/react";

const GameLayout = () => {
    return (
        <>
            <Header/>
            <main>
                <Container maxW={'1480px'} h={'90vh'}>
                    <Outlet />
                </Container>
            </main>
        </>
    )
}

export default GameLayout