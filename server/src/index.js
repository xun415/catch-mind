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

    if (room) {
        // send response that room exists
        if (room.connectedUsers.length > 3) {
            return res.send({ isFull: true })
        } else {
            return res.send({ isFull: false })
        }
    } else {
        // send response that room does not exists
        return res.status(404)
    }
})

io.on('connection', (socket) => {

})


server.listen(PORT)