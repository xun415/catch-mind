import Header from "@components/organisms/Header";
import { Outlet } from 'react-router-dom'

const Layout = () => {
    return (
        <>
            <Header/>
            <main>
                <Outlet />
            </main>
        </>
    )
}

export default Layout