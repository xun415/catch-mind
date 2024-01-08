import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'

@WebSocketGateway()
export class SignalGateway {
    @WebSocketServer() server: Server;

    // webRTC 연결을 위한 시그널링 데이터 주고받기
    @SubscribeMessage('conn-signal')
    signalingHandler(socket: Socket, data: {connUserSocketId: string, signal: any}) {
        const { connUserSocketId, signal } = data

        const signalingData = {
            // simple-peer 의 SignalData type (전달만 해주므로 type 을 위한 lib 설치 배제)
            signal,
            // sender의 socket.id로 변경
            connUserSocketId: socket.id
        }

        this.server.to(connUserSocketId).emit('conn-signal', signalingData)
    }

    // 기존에 방 인원이 webRTC 커넥션 준비가 되었다고 알려주기
    @SubscribeMessage('conn-init')
    initializeConnectionHandler(socket: Socket, data: {connUserSocketId: string}) {
        const initData = { connUserSocketId: socket.id }
        this.server.to(data.connUserSocketId).emit('conn-init', initData)
    }

}