import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";

type UserContextType = {
    nickname?: string
    setNickname: Dispatch<SetStateAction<string>>
}

const UserContext = createContext<UserContextType>({
    nickname: undefined,
    setNickname: () => {}
})

export const useUserContext = (): UserContextType =>
    useContext<UserContextType>(UserContext)

type UserContextProviderProps = {
    children?: ReactNode
}

export const UserContextProvider = ({children}: UserContextProviderProps) => {
    const [nickname, setNickname] = useState<string | undefined>(undefined)

    return (
        <UserContext.Provider
            value={{
                nickname,
                setNickname
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
