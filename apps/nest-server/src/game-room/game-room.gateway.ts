import {SubscribeMessage, WebSocketGateway, WebSocketServer} from "@nestjs/websockets";
import {Server, Socket} from 'socket.io'
import { v4 as uuid } from 'uuid';
import {User} from "../user/user.interface";
import {GameRoomService} from "./game-room.service";
import {UserService} from "../user/user.service";
import {GameRoom, Player, RoomConfig} from "./game-room.interface";
import dayjs from "dayjs";
import {CATCH_MIND_WORD_LIST} from "../data/word";

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

        if (!user) return;

        // 유저가 속한 방 찾기
        const room  = this.gameRoomService.findOneById(user.roomId)

        // 방에서 유저 제거
        const leftPlayerCount = this.gameRoomService.removePlayer(user.roomId, user.id)

        // leave socket io room
        socket.leave(user.roomId)

        if (leftPlayerCount < 1) return;

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
    selectWordHandler(data) {
        const { roomId, selectedWord } = data
        // 참여하고자 하는 방 찾기
        const room = this.gameRoomService.findOneById(roomId)

        const newSession = {
            startAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            endAt: null,
            answer: selectedWord,
            round: room.currentRound,
            drawPlayer: { ...room.drawPlayer }
        }

        room.sessions = Array.isArray(room.sessions) ? [...room.sessions, newSession] : [newSession]

        const gameSessionLength = room.sessions.length

        this.messageHandler(roomId, '단어 선택이 완료되었습니다. 게임을 시작합니다.', 'notice', undefined)
        this.server.to(roomId).emit('game-start', { wordLength: selectedWord.length })

        function checkAnswer () {
            setTimeout(() => {
                // 같은 게임 세션 진행중 여부 확인
                const isSameSession = gameSessionLength === room.sessions.length
                // 이미 정답을 맞춰 다음 게임으로 진행됬을 경우 무시
                if (!isSameSession) {
                    return;
                }

                this.messageHandler(roomId, `시간 초과. 정답은 ${selectedWord} 이었습니다.`, 'notice', undefined)
                this.gameSessionFinishHandler(roomId)
            }, Number(room.timePerRound * 1000))
        }
        checkAnswer()
    }

    @SubscribeMessage('guess-answer')
    guessAnswerHandler() {

    }

    gameSessionFinishHandler(roomId) {
        const room = this.gameRoomService.findOneById(roomId)
        if (!room) {
            // 방 사라졌을 경우 대비
            return;
        }
        // 게임 종료 조건 확인 (현재 라운드가 마지막 라운드이고, 현재 참여자가 현 라운드의 세션을 한번씩 진행 했을 경우)
        const isRoomLastRound = room.currentRound === room.totalRound

        // 현 라운드의 세션 진행한 플레이어 목록
        const sessionDonePlayerIds = room.sessions
            // 현재 라운드 세션 목록
            .filter(session => session.round === room.currentRound)
            // 플레이어들 목록
            .map(session => session.drawPlayer.id)

        // 방의 참여자가 현 라운드의 세션을 한번씩 진행했는지 여부
        const isEveryPlayersDoneSession = room.players
            .map(p => p.id)
            .every(id => sessionDonePlayerIds.includes(id))

        if (isRoomLastRound && isEveryPlayersDoneSession) {
            // 게임 종료
            this.server.to(roomId).emit('game-end', room)
            this.messageHandler(roomId, '게임이 종료되었습니다.', 'notice' , undefined)
            return;
        }

        // 게임 미종료 (라운드 업데이트, 단어 선택 진행)
        if (isEveryPlayersDoneSession) {
            room.currentRound += 1
        }

        // 선택할 단어 목록
        const randomWords = selectRandomWords(CATCH_MIND_WORD_LIST, room.sessions.map(s => s.answer))

        // 다음 플레이어 선정
        const nextDrawer = isEveryPlayersDoneSession?
            room.players[0]
            :
            room.players.filter(player => !sessionDonePlayerIds.includes(player.id))[0]

        room.drawPlayer = nextDrawer

        // 게임 세션 종료 알림
        this.server.to(roomId).emit('game-session-end', { nextDrawer, currentRound: room.currentRound })

        // 단어 선택 이벤트
        this.server.to(nextDrawer.socketId).emit('select-word', {
            randomWords
        })
        this.messageHandler(roomId, `${nextDrawer.username}님이 단어를 선택중입니다.`, 'notice', undefined)
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