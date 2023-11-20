import Header from "@components/organisms/Header";
import { Outlet } from 'react-router-dom'

const GameLayout = () => {
    return (
        <>
            <Header/>
            <main>
                gameLayout
                <Outlet />
            </main>
        </>
    )
}

export default GameLayout