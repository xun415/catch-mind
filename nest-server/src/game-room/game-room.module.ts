import { Module } from '@nestjs/common';
import { GameRoomController } from './game-room.controller';
import { GameRoomService } from './game-room.service';

@Module({
  controllers: [GameRoomController],
  providers: [GameRoomService]
})
export class GameRoomModule {}
