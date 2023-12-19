require('./types')

require("dotenv").config();

const express = require('express')
const http = require('http')
const { v4: uuid } = require('uuid')
const cors = require('cors')

const PORT = process.env.PORT || 5002

const app = express();

const server = http.createServer(app)
app.use(cors({
    credentials: true,
    origin: ['http://localhost:5173'],
}))

const io = require('socket.io')(server, {
    cors: {
        origin: '*',
        methods: ['GET', 'POST']
    }
})

/**
 * 소켓 연결된 유저 리스트
 * @type {User[]} connectedUsers
 */
let connectedUsers = []


/**
 * 게임방 목록
 * @type {Room[]} rooms
 */
let rooms =  []

app.get('/api/rooms/:roomId/is-full', (req, res) => {
    const {roomId} = req.params
    const room = rooms.find(room => room.id === roomId)

    console.log('room: ', room)

    if (!room) {
        // 404 리턴
        return res.status(404).send()
    }

    if (room.players.length > room.maxPlayerNumber) {
        return res.send({ isFull: true })
    }

    return res.send({ isFull: false })

})

app.get('/api/rooms/:roomId', (req, res) => {
    const {roomId} = req.params
    const room = rooms.find(room => room.id === roomId)

    if (!room) {
        // 404 리턴
        return res.status(404).send()
    }

    return res.send({ room })
})

io.on('connection', (socket) => {
    console.log('socket', socket.id)
    socket.on('create-new-room', (data) => {
        console.log('create-new-room ', data)
        createNewRoomHandler(data, socket)
    })

    socket.on('join-room', (data) => {
        console.log('join-room', data)
        joinRoomHandler(data, socket)
    })

    socket.on('complete-setting', data => {
        console.log('complete-setting', data)
    })

    socket.on('disconnect', () => {
        disconnectHandler(socket)
    })

    socket.on('conn-signal', data => {
        console.log('[server] conn-signal')
        signalingHandler(data, socket)
    })

    socket.on('conn-init', data => {
        console.log('[server] conn-init')
        initializeConnectionHandler(data, socket)
    })

    // 게임방 설정 변경 시
    socket.on('change-room-config', (data) => {
        changeRoomSettingHandler(data)
    })

    // 게임 시작 이벤트 시
    socket.on('start-game', () => {
        /**
         * todo
         * 채팅 이벤트 emit(선택중 등)
         * 방 라운드 정보 업데이트 및 진행 유저 지정
         */
    })

    // 진행 유저가 선택지 골랐을 시
    socket.on('choose-question', (data) => {
        /**
         * todo
         * 유저가 고른 값을 현 라운드의 정답으로 저장하고,
         * 현 라운드 진행
         */

    })

    // 정답 확인 시
    socket.on('guess-answer', data => {
        /**
         * todo
         * 채팅 이벤트 emit(전체 유저 채팅 목록에 정답 내역 보이게 함)
         * 정답 확인
         * 정답 시 -> 유저정보(스코어) 업데이트, 방 라운드 정보 업데이트 후 다음 라운드 유저 진행
         */
    })
})


// 게임 방 생성
const createNewRoomHandler = (data, socket) => {
    const { username } = data

    const roomId = uuid();

    /**
     * 새 유저 정보
     * @type { User } newUser
     */
    const newUser = {
        username,
        id: uuid(),
        socketId: socket.id,
        roomId,
    }

    // 연결 유저 목록에 추가
    connectedUsers = [...connectedUsers, newUser]

    /**
     * 새로운 방 생성
     * @type {Room} newRoom
     */
    const newRoom = {
        id: roomId,
        players: [
            {
                ...newUser,
                playedRound: 0,
                score: 0,
            }
        ],
        currentRound: 0,
        currentPlayer: null,
        // config
        maxPlayerNumber: 4,
        timePerRound: 60,
        totalRound: 3,
    }
    console.log('[server] room created')

    // join socket.io room
    socket.join(roomId)

    rooms = [...rooms, newRoom]

    // 방 생성 유저에 방 아이디 전달
    socket.emit('room-created', { roomId })

    // 연결된 유저에게 방 업데이트
    socket.emit('player-update', { players: newRoom.players })
}

/**
 *
 * @param data
 * @param socket
 */
const joinRoomHandler = (data, socket) => {
    const { username, roomId } = data

    /**
     *
     * @type { User } newUser
     */
    const newUser = {
        username,
        id: uuid(),
        socketId: socket.id,
        roomId,
    }

    // 참여하고자 하는 방 찾기
    const room = rooms.find(room => room.id === roomId)

    room.players = [
        ...room.players,
        {
            ...newUser,
            playedRound: 0,
            score: 0,
        }
    ]

    // join socket.io room
    socket.join(roomId)

    // 연결 유저 목록에 추가
    connectedUsers = [...connectedUsers, newUser]

    // 참여한 유저들에게 webRTC 연결 준비 이벤트 발송
    room.players.forEach(user => {
        // 본인 제외
        if (user.socketId !== socket.id) {
            const data = {
                connUserSocketId: socket.id
            };

            io.to(user.socketId).emit('conn-prepare', data)
        }
    })

    // 룸에 있는 유저들에게 유저 업데이트
    io.to(roomId).emit('player-update', { players: room.players })
}

const changeRoomSettingHandler = (data) => {
    console.log('changeRoomSettingHandler',data)
    const changedOption = {

    }
    const { roomId, totalRound, maxPlayerNumber, timePerRound } = data

    // 참여하고자 하는 방 찾기
    const roomIdx = rooms.findIndex(room => room.id === roomId)

    // 방 업데이트
    const updatedRoom = { ...rooms[roomIdx] }
    updatedRoom[data.key] = data.value

    rooms[roomIdx] = updatedRoom

    // 유저들에게 방 정보 업데이트 알려주기
    io.to(roomId).emit('change-room-config', { totalRound, maxPlayerNumber, timePerRound })
}

const disconnectHandler = (socket) => {
    // 연결 유저 목록에서 유저 찾기
    const user = connectedUsers.find(user => user.socketId === socket.id)

    if (user) {
        // 유저가 속한 방 찾기
        const room  = rooms.find(room => room.id === user.roomId)

        // 방에서 유저 제거
        room.players = room.players.filter(user => user.socketId !== socket.id)

        // leave socket io room
        socket.leave(user.roomId)

        if (room.players.length > 0) {

            // 연결이 끊긴 socketId 알려주기 (각 종단에서 webRTC 연결 해제)
            io.to(room.id).emit('user-disconnected', { socketId: socket.id })

            // 남아있는 유저들에게 방 정보 업데이트
            io.to(room.id).emit('player-update', {
                players: room.players
            })
        } else {
            // 유저 없을 시 방 제거
            rooms = rooms.filter(r => r.id !== room.id)
        }
    }
}

const signalingHandler = (data, socket) => {
    const { connUserSocketId, signal } = data


    const signalingData = {
        signal,
        // sender의 socket.id로 변경
        connUserSocketId: socket.id
    }

    io.to(connUserSocketId).emit('conn-signal', signalingData)
}

// 기존에 방 인원이 webRTC 커넥션 준비가 되었다고 알려주기
const initializeConnectionHandler = (data, socket) => {
    const { connUserSocketId }  = data

    const initData = { connUserSocketId: socket.id }
    io.to(connUserSocketId).emit('conn-init', initData)
}


server.listen(PORT)