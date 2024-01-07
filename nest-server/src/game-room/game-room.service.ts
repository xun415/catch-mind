import { Injectable } from '@nestjs/common';
import {GameRoom} from "./game-room.interface";

@Injectable()
export class GameRoomService {
    rooms: GameRoom[] = []

    findAll() {
        return this.rooms
    }

    findOneById(id: string): GameRoom | undefined {
        return this.rooms.find(room => room.id === id)
    }

}
