import io, { type Socket } from 'socket.io-client'
import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";
import {Stream} from "stream";

const SERVER_URL = 'http://localhost:5002'

type SocketContextType = {
    socket: Socket| null
    socketId: string | null

}

const SocketContext = createContext<SocketContextType>({
    socket: null,
    socketId: null
})

export const useSocketContext = (): SocketContextType =>
    useContext<SocketContextType>(SocketContext)

type SocketContextProviderProps = {
    children?: ReactNode
}

export const SocketContextProvider = ({ children }: SocketContextProviderProps) => {
    const [socketValue, setSocketValue] = useState<Socket | null>(null)
    const [socketId, setSocketId] = useState<string | null>(null)
    const playersStreamRefs = useRef<{[key: string]: Stream}>({})

    useEffect(() =>{
        const socket = io(SERVER_URL)
        setSocketId(socket.id)
        setSocketValue(socket)
        console.log('socket connected: ', socket)

        return () => {
            console.log('disconnect')
            socket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider
            value={{
                socket: socketValue,
                socketId
            }}>
            {children}
        </SocketContext.Provider>
    )
}
