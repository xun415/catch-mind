require('./types')

require("dotenv").config();

const express = require('express')
const http = require('http')
const { v4: uuid } = require('uuid')
const cors = require('cors')

const PORT = process.env.PORT || 5002

const app = express();

const server = http.createServer(app)
app.use(cors())

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

    if (!room) {
        // 404 리턴
        return res.status(404)
    }

    if (room.connectedUsers.length > 3) {
        return res.send({ isFull: true })
    } else {
        return res.send({ isFull: false })
    }
})

io.on('connection', (socket) => {
    socket.on('create-new-room', (data) => {
        createNewRoomHandler(data, socket)
    })

    socket.on('join-room', (data) => {
        joinRoomHandler(data, socket)
    })

    socket.on('disconnect', () => {
        disconnectHandler(socket)
    })

    socket.on('conn-signal', data => {
        signalingHandler(data, socket)
    })

    socket.on('conn-init', data => {
        initializeConnectionHandler(data, socket)
    })
})

// 게임 방 생성
const createNewRoomHandler = (data, socket) => {
    const { username } = data

    const roomId = uuid();

    // 새 유저 정보
    const newUser = {
        username,
        id: uuid(),
        socketId: socket.id,
        roomId,
    }

    // 연결 유저 목록에 추가
    connectedUsers = [...connectedUsers, newUser]

    // 새로운 방 생성
    const newRoom = {
        id: roomId,
        connectedUsers: [newUser]
    }

    // join socket.io room
    socket.join(roomId)

    rooms = [...rooms, newRoom]

    // 방 생성 유저에 방 아이디 전달
    socket.emit('room-id', { roomId })

    // 연결된 유저에게 방 업데이트
    socket.emit('room-update', { connectedUsers: newRoom.connectedUsers })
}

/**
 *
 * @param data
 * @param socket
 */
const joinRoomHandler = (data, socket) => {
    const { username, roomId } = data

    const newUser = {
        username,
        id: uuid(),
        socketId: socket.id,
        roomId,
    }

    // 참여하고자 하는 방 찾기
    const room = rooms.find(room => room.id === roomId)

    room.connectedUsers = [...room.connectedUsers, newUser]

    // join socket.io room
    socket.join(roomId)

    // 연결 유저 목록에 추가
    connectedUsers = [...connectedUsers, newUser]

    // 참여한 유저들에게 webRTC 연결 준비 이벤트 발송
    room.connectedUsers.forEach(user => {
        // 본인 제외
        if (user.socketId !== socket.id) {
            const data = {
                connUserSocketId: socket.id
            };

            io.to(user.socketId).emit('conn-prepare', data)
        }
    })

    // 룸에 있는 유저들에게 유저 업데이트
    io.to(roomId).emit('room-update', { connectedUsers: room.connectedUsers })
}

const disconnectHandler = (socket) => {
    // 연결 유저 목록에서 유저 찾기
    const user = connectedUsers.find(user => user.socketId === socket.id)

    if (user) {
        // 유저가 속한 방 찾기
        const room  = rooms.find(room => room.id === user.roomId)

        // 방에서 유저 제거
        room.connectedUsers = room.connectedUsers.filter(user => user.socketId !== socket.id)

        // leave socket io room
        socket.leave(user.roomId)

        // close the room if amount of the users which will stay in room will be 0
        if (room.connectedUsers.length > 0) {

            // 연결이 끊긴 socketId 알려주기 (각 종단에서 webRTC 연결 해제)
            io.to(room.id).emit('user-disconnected', { socketId: socket.id })

            // 남아있는 유저들에게 방 정보 업데이트
            io.to(room.id).emit('room-update', {
                connectedUsers: room.connectedUsers
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