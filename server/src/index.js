require('./types')

require("dotenv").config();

const express = require('express')
const http = require('http')
const { v4: uuid } = require('uuid')
const cors = require('cors')
const dayjs = require('dayjs')
const {CATCH_MIND_WORD_LIST} = require("./data/word");

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
    const room = findRoomById(rooms, roomId)

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
    const room = findRoomById(rooms, roomId)

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

    // 게임 설정 완료 시
    socket.on('finish-config', (roomId) => {
        console.log('[server] finish-config', socket.id)
        /**
         * todo
         * 채팅 이벤트 emit(선택중 등)
         * 방 라운드 정보 업데이트 및 진행 유저 지정
         */
        // 참여하고자 하는 방 찾기
        const roomIdx = rooms.findIndex(room => room.id === roomId)

        const players = rooms[roomIdx].players

        // 방 업데이트
        const updatedRoom = {
            ...rooms[roomIdx],
            currentRound: 1,
            drawPlayer: players[0],
            sessions: []
        }

        rooms[roomIdx] = updatedRoom

        // 유저들에게 방 정보 업데이트 알려주기
        io.to(roomId).emit('finish-config', players[0])
        messageHandler(roomId, `${players[0].username}님이 단어를 고르고 있습니다.`)

        // 선택할 단어 목록
        const randomWords = selectRandomWords(CATCH_MIND_WORD_LIST,[])

        // 단어 선택 이벤트
        socket.emit('select-word', {
            randomWords
        })

    })

    socket.on('start-game', (data) => {
        const {roomId} = data
        const roomIdx = rooms.findIndex(room => room.id === roomId)

        // 방 업데이트
        const updatedRoom = { ...rooms[roomIdx] }
    })

    // 진행 유저가 선택지 골랐을 시
    socket.on('select-word', (data) => {
        const { roomId, selectedWord } = data
        /**
         * todo
         * 유저가 고른 값을 현 라운드의 정답으로 저장하고,
         * 현 라운드 진행
         */
        // 참여하고자 하는 방 찾기
        const roomIdx = rooms.findIndex(room => room.id === roomId)

        /** @type {Room} room */
        const room = rooms[roomIdx]

        room.sessions = [...room.sessions, {
            startAt: dayjs().format('YYYY-MM-DD HH:mm:ss'),
            endAt: null,
            answer: selectedWord,
            round: room.currentRound,
            drawPlayer: { ...room.drawPlayer }
        }]

        const gameSessionLength = room.sessions.length

        messageHandler(roomId, '단어 선택이 완료되었습니다. 게임을 시작합니다.')
        io.to(roomId).emit('game-start', { wordLength: selectedWord.length })

        function checkAnswer () {
            setTimeout(() => {
                // 같은 게임 세션 진행중 여부 확인
                const isSameSession = gameSessionLength === rooms[roomIdx]?.sessions?.length
                // 이미 정답을 맞춰 다음 게임으로 진행됬을 경우 무시
                if (!isSameSession) {
                    return;
                }

                messageHandler(roomId, `시간 초과. 정답은 ${selectedWord} 이었습니다.`)
                gameSessionFinishHandler(roomId)
            }, Number(room.timePerRound * 1000))
        }
        checkAnswer()
    })

    // 정답 확인 시
    socket.on('guess-answer', data => {
        console.log('[guess-answer] data: ', data)
        const { roomId, answer } = data
        /**
         * todo
         * 채팅 이벤트 emit(전체 유저 채팅 목록에 정답 내역 보이게 함)
         * 정답 확인
         * 정답 시 -> 유저정보(스코어) 업데이트, 방 라운드 정보 업데이트 후 다음 라운드 유저 진행
         */



        // 방 찾기
        const roomIdx = rooms.findIndex(room => room.id === roomId)
        const room = rooms[roomIdx]

        // 유저 찾기
        const userIdx = room.players.findIndex(p => p.socketId === socket.id)
        const user = room.players[userIdx]

        // 세션 진행중 여부, 세션 찾기
        const isOnSession = room.sessions && room.sessions.length > 0
        if (!isOnSession) {
            // 게임 세션 진행중 아닐 경우 단순 메세지 처리
            messageHandler(roomId, answer, 'chatting', user.username)
            return;
        }

        const currentSessionIdx = room.sessions.length - 1
        const currentSession = room.sessions[currentSessionIdx]



        /** @type {Player} drawPlayer */
        const drawPlayer = { ...room.drawPlayer }

        // 정답 확인
        const isCorrectAnswer = currentSession.answer === answer

        if (!isCorrectAnswer) {
            messageHandler(roomId, answer, 'chatting', user.username)
            return;
        }

        // 술래가 정답을 말했을 경우 채팅 및 정답 처리 무시
        if (user.id === drawPlayer.id) {
            return;
        }

        messageHandler(roomId, `${user.username}님이 정답을 맞췄습니다.`)

        // 유저 점수 업데이트 (맞춘 플레이어에게 남은 시간 초 * 10점, 그린 플리이어에게 남은 시간 초 * 5점)
        const timePassed = dayjs(currentSession.startAt).diff(dayjs(), 'seconds')
        const leftTime = room.timePerRound - timePassed

        user.score += (leftTime * 10)
        room.players[userIdx] = { ...user }
        drawPlayer.score += (leftTime * 5)
        const drawPlayerIdx = room.players.findIndex(p => p.socketId === drawPlayer.socketId)
        room.players[drawPlayerIdx] = {...drawPlayer}

        io.to(roomId).emit('player-update', { players: room.players })

        // rooms[roomIdx] = { ...room }

        gameSessionFinishHandler(roomId)
    })
})

const gameSessionFinishHandler = (roomId) => {
    const room = findRoomById(rooms, roomId)
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
        io.to(roomId).emit('game-end', room)
        messageHandler(roomId, '게임이 종료되었습니다.')
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
    io.to(roomId).emit('game-session-end', nextDrawer)

    // 단어 선택 이벤트
    io.to(nextDrawer.socketId).emit('select-word', {
        randomWords
    })
    messageHandler(roomId, `${nextDrawer.username}님이 단어를 선택중입니다.`)
}

/**
 * 게임룸에 메세지를 전달합니다.
 *
 * @param roomId
 * @param content 표시할 내용
 * @param {'notice' | 'chatting'} type
 * @param {string | undefined} senderName
 */
const messageHandler = (roomId, content, type = 'notice', senderName) => {
    io.to(roomId).emit('message', { content, type, senderName })
}


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
        drawPlayer: null,
        // config
        maxPlayerNumber: 4,
        timePerRound: 120,
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
    messageHandler(roomId, `${username}님이 입장하셨습니다.`)
}

const changeRoomSettingHandler = (data) => {
    const { roomId, ...roomConfig } = data
    // 참여하고자 하는 방 찾기
    const roomIdx = rooms.findIndex(room => room.id === roomId)

    /**
     * @type {Room} updatedRoom
     */
    const updatedRoom = { ...rooms[roomIdx], ...roomConfig }

    // 방 업데이트
    rooms[roomIdx] = { ...updatedRoom }

    // 유저들에게 방 정보 업데이트 알려주기
    const { totalRound, maxPlayerNumber, timePerRound } = updatedRoom
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
            messageHandler(room.id, `${user.username}님이 방을 나갔습니다.`)
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

/**
 *
 * @param {string[]} excludes
 * @param {number} selectCnt
 *
 * @return {string[]} randomWords
 */
const selectRandomWords = (wordList, excludes, selectCnt = 3, randomFunc = Math.random) => {
    const excluded = wordList.filter(word => !excludes.includes(word));

    return Array.from({ length: selectCnt }, () =>
        excluded[Math.floor(randomFunc() * excluded.length)]
    );
};

const findRoomById = (rooms, roomId) => {
    return rooms.find(room => room.id === roomId);
}


server.listen(PORT)