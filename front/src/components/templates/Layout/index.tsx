import {ReactNode} from "react";
import Header from "../../organisms/Header";
import {Center} from "@chakra-ui/react";

type Props = {
    children: ReactNode
}

const Layout = ({children}: Props) => {
    return (
        <>
            <Header/>
            <main>
                <Center>{children}</Center>
            </main>
        </>
    )
}

export default Layout