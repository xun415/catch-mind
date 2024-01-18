import {createContext, createRef, ReactNode, RefObject, useContext, useRef} from "react";

type StreamContextType = {
   streamsRef: RefObject<{ [key: string]: MediaStream }>

}

const StreamContext = createContext<StreamContextType>({
    streamsRef: createRef()
})

export const useStreamContext = (): StreamContextType =>
    useContext<StreamContextType>(StreamContext)

type SteamContextProviderProps = {
    children?: ReactNode
}

export const StreamContextProvider = ({ children }: SteamContextProviderProps) => {
    const streamsRef = useRef<{[key: string]: MediaStream}>({})

    return (
        <StreamContext.Provider value={{ streamsRef }}>
            {children}
        </StreamContext.Provider>
    )
}
