import create from 'zustand'
import {devtools} from "zustand/middleware";

type UserStoreProps = {
    username: string
    setUsername: (username: string) => void
}

const useUserStore = create<UserStoreProps>()(
    devtools(
        set => ({
            username: '',
            setUsername: (username: string) => {
                set(prev => ({
                    ...prev,
                        username
                }))
            }
        })
    )
)

export default useUserStore