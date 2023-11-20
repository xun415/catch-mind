import { type RouteObject, useRoutes } from 'react-router-dom'
import IndexPage from "@pages";
import GameSettingPage from "@pages/gameSetting";
import GamePage from "@pages/game";
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
                        element: <GamePage />
                    }
                ]
            },

        ] as RouteObject[])
    )
}

export default routes