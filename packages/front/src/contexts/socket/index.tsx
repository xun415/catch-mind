import io, { type Socket } from 'socket.io-client'
import {createContext, ReactNode, useContext, useEffect, useRef, useState} from "react";

const SERVER_URL = 'http://localhost:5004'

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
    const socketRef = useRef<Socket| null>(null)
    const [socketId, setSocketId] = useState<string | null>(null)

    useEffect(() =>{
        const socket = io(SERVER_URL)
        setSocketId(socket.id)
        socketRef.current = socket
        console.log('socket connected: ', socket)

        return () => {
            console.log('disconnect')
            socket.disconnect()
        }
    }, [])

    return (
        <SocketContext.Provider
            value={{
                socket: socketRef.current,
                socketId
            }}>
            {children}
        </SocketContext.Provider>
    )
}
