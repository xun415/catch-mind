import { Injectable } from '@nestjs/common';
import {GameRoom, Player} from "./game-room.interface";

@Injectable()
export class GameRoomService {
    rooms: GameRoom[] = []

    findAll() {
        return this.rooms
    }

    findOneById(id: string): GameRoom | undefined {
        return this.rooms.find(room => room.id === id)
    }

    register(newRoom: GameRoom) {
        this.rooms.push(newRoom)
    }

    addPlayer(roomId: string, newPlayer: Player) {
        const room = this.findOneById(roomId)
        if (room) {
            room.players.push(newPlayer)
        }
    }

    modify(modifiedRoom: Pick<GameRoom, 'id'> & Partial<GameRoom>) {
        const roomIdx = this.rooms.findIndex(r => r.id === modifiedRoom.id)
        if (roomIdx > -1) {
            this.rooms[roomIdx] = { ...this.rooms[roomIdx], ...modifiedRoom }
        }
    }

    modifyForPlayer(roomId: string, modifiedPlayer: Player) {
        const room = this.findOneById(roomId)
        if (!room) return;

        const playerIdx = room.players.findIndex(p => p.id === modifiedPlayer.id)
        room.players[playerIdx] = { ...room.players[playerIdx], ...modifiedPlayer }
    }

    removePlayer(roomId: string, removePlayerId): number {
        const room = this.findOneById(roomId)
        if (!room) return;

        room.players = room.players.filter(player => player.id !== removePlayerId)
        // player 가 없을 경우 room 제거
        if (room.players.length === 0) {
            this.rooms = this.rooms.filter(r => r.id !== room.id)
        }

        return room.players.length
    }

}
