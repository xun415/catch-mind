import { Module } from '@nestjs/common';
import { GameRoomController } from './game-room.controller';
import { GameRoomService } from './game-room.service';
import {GameRoomGateway} from "./game-room.gateway";
import {UserService} from "../user/user.service";

@Module({
  controllers: [GameRoomController],
  providers: [GameRoomService, GameRoomGateway, UserService]
})
export class GameRoomModule {}
