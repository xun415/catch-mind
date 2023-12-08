import io, { type Socket } from 'socket.io-client'
import {createContext, createRef, ReactNode, Ref, RefObject, useContext, useEffect, useRef, useState} from "react";
import {Stream} from "stream";

const SERVER_URL = 'http://localhost:5002'

type StreamContextType = {
   streamsRef: RefObject<{ [key: string]: Stream }>

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
    const streamsRef = useRef<{[key: string]: Stream}>({})

    return (
        <StreamContext.Provider value={{ streamsRef }}>
            {children}
        </StreamContext.Provider>
    )
}
