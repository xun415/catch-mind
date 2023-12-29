import Header from "@components/ui/Header";
import { Outlet } from 'react-router-dom'
import {Center, Container} from "@chakra-ui/react";

const Layout = () => {
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

export default Layout