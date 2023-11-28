import {createContext, Dispatch, ReactNode, SetStateAction, useContext, useState} from "react";

type UserContextType = {
    username?: string
    setUsername: Dispatch<SetStateAction<string>>
}

const UserContext = createContext<UserContextType>({
    username: undefined,
    setUsername: () => {}
})

export const useUserContext = (): UserContextType =>
    useContext<UserContextType>(UserContext)

type UserContextProviderProps = {
    children?: ReactNode
}

export const UserContextProvider = ({children}: UserContextProviderProps) => {
    const [username, setUsername] = useState<string | undefined>(undefined)

    return (
        <UserContext.Provider
            value={{
                username: username,
                setUsername: setUsername
            }}
        >
            {children}
        </UserContext.Provider>
    )
}
