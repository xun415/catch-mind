import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { v4 as uuid } from 'uuid';
import {User} from "../user/user.interface";
import {GameRoomService} from "./game-room.service";
import {UserService} from "../user/user.service";
import {GameRoom, Player, RoomConfig} from "./game-room.interface";

@WebSocketGateway()
export class GameRoomGateway {
    constructor(private gameRoomService: GameRoomService, private userService: UserService) {}
    @WebSocketServer() server: Server;

    // 방 생성 시
    @SubscribeMessage('create-new-room')
    createNewRoomHandler(socket: Socket, data: {username: string}) {
        const { username } = data

        const roomId = uuid();

        // 유저 등록
        const newUser: User = {
            username,
            id: uuid(),
            socketId: socket.id,
            roomId,
            isHost: true
        }
        this.userService.register(newUser)

        // 새로운 방 등
        const newRoom: GameRoom = {
            id: roomId,
            players: [
                {
                    ...newUser,
                    playedRound: 0,
                    score: 0,
                }
            ],
            currentRound: 0,
            drawPlayer: null,
            // config
            maxPlayerNumber: 4,
            timePerRound: 120,
            totalRound: 3,
            sessions: []
        }
        this.gameRoomService.register(newRoom)

        // join socket.io room
        socket.join(roomId)

        // 방 생성 유저에 방 아이디 전달
        socket.emit('room-created', { roomId })

        this.playerUpdateHandler(roomId, newRoom.players)
    }

    // 방 참여 시
    @SubscribeMessage('join-room')
    joinRoomHandler(socket: Socket, data: { username: string, roomId: string }) {
        const { username, roomId } = data
        const newUser = {
            username,
            id: uuid(),
            socketId: socket.id,
            roomId,
            isHost: false
        }
        this.userService.register(newUser)

        this.gameRoomService.addPlayer(roomId, { ...newUser, score: 0, playedRound: 0 })

        socket.join(roomId)

    }

    // 유저 이탈 시
    @SubscribeMessage('disconnect')
    disconnectHandler(socket: Socket) {
        const user = this.userService.findOneBySocketId(socket.id)

        if (user) {
            // 유저가 속한 방 찾기
            const room  = this.gameRoomService.findOneById(user.roomId)

            // 방에서 유저 제거
            const leftPlayerCount = this.gameRoomService.removePlayer(user.roomId, user.id)

            // leave socket io room
            socket.leave(user.roomId)

            if (leftPlayerCount > 0) {

                // 연결이 끊긴 socketId 알려주기 (각 종단에서 webRTC 연결 해제)
                this.server.to(room.id).emit('user-disconnected', { socketId: socket.id })

                // 남아있는 유저들에게 방 정보 업데이트
                this.playerUpdateHandler(room.id, room.players)

                this.messageHandler(room.id, `${user.username}님이 방을 나갔습니다.`, 'notice', undefined)

                // 방장 이탈 시 넘겨주기
                if (user.isHost) {
                    const nextHost = { ...room.players.filter(p => !p.isHost)[0], isHost: true }
                    this.gameRoomService.modifyForPlayer(room.id, nextHost)
                    this.server.to(nextHost.socketId).emit('set-room-host')
                }

                // 연결 유저목록에서 제거
                this.userService.remove(user.id)
            }
        }
    }
    @SubscribeMessage('change-room-config')
    changeRoomSettingHandler(data: { roomId: string } & RoomConfig) {
        const { roomId, ...roomConfig } = data

        this.gameRoomService.modify({ id: roomId, ...roomConfig })

        // 유저들에게 방 정보 업데이트 알려주기
        this.server.to(roomId).emit('change-room-config', { ...roomConfig })
    }

    @SubscribeMessage('finish-config')
    finishConfigHandler() {

    }

    @SubscribeMessage('select-word')
    selectWordHandler() {

    }

    @SubscribeMessage('guess-answer')
    guessAnswerHandler() {

    }

    // 연결된 유저에게 방 업데이트
    playerUpdateHandler(roomId: string, players: Player[]) {
        this.server.to(roomId).emit('player-update', { players })
    }

    // 게임룸에 메세지 전달
    messageHandler(roomId: string, content: string, type: 'notice' | 'chat', senderName: string | undefined) {
        this.server.to(roomId).emit('message', { content, type, senderName })
    }
}