import {NotFoundException, Controller, Get, Param} from '@nestjs/common';
import {GameRoomService} from "./game-room.service";
import {GameRoom} from "./game-room.interface";

@Controller('game-room')
export class GameRoomController {
    constructor(private gameRoomService: GameRoomService) {}

    @Get('/:id')
    getRoom(@Param('id') id: string) {
        const room = this.gameRoomService.findOneById(id)

        if (!room) {
            throw new NotFoundException('해당 room을 찾을 수 없습니다.')
        }

        return room
    }

    @Get('/:id/is-full')
    getIsRoomFull(@Param('id') id: string) {
        const room = this.gameRoomService.findOneById(id)

        if (!room) {
            throw new NotFoundException('해당 room을 찾을 수 없습니다.')
        }

        if (room.players.length >= room.maxPlayerNumber) {
            return { isFull: true }
        }

        return { isFull: false }
    }
}
