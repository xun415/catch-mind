import { type RouteObject, useRoutes } from 'react-router-dom'
import IndexPage from "../pages";
import GameSettingPage from "../pages/GameSetting";
import GamePage from "../pages/Game";

const routes = () => {

    return (
        useRoutes([
            {
                path: '/',
                element: <IndexPage />
            },
            {
                path: 'gameSetting',
                element: <GameSettingPage />
            },
            {
                path: 'game',
                element: <GamePage />
            }
        ] as RouteObject[])
    )
}

export default routes