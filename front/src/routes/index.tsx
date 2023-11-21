import { type RouteObject, useRoutes } from 'react-router-dom'
import IndexPage from "@pages/index";
import GameSettingPage from "@pages/gameSetting";
import GameRoomPage from "@pages/gameRoom";
import Layout from "@components/templates/Layout";
import GameLayout from "@components/templates/GameLayout";

const routes = () => {

    return (
        useRoutes([
            {

                element: <Layout />,
                children: [
                    {
                        path: '/',
                        element: <IndexPage />
                    }
                ]
            },
            {
                element: <GameLayout />,
                children: [
                    {
                        path: 'gameSetting',
                        element: <GameSettingPage />
                    },
                    {
                        path: 'game',
                        element: <GameRoomPage />
                    }
                ]
            },

        ] as RouteObject[])
    )
}

export default routes