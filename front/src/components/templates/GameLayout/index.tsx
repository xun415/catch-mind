import Header from "@components/ui/Header";
import { Outlet } from 'react-router-dom'
import {Center, Container} from "@chakra-ui/react";

const GameLayout = () => {
    return (
        <>
            <Header/>
            <main css={{ height: '90vh'}}>
                <Container maxW={'1480px'} h={'100%'}>
                    <Outlet />
                </Container>
            </main>
        </>
    )
}

export default GameLayout