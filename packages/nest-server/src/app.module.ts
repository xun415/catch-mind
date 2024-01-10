import { Module } from '@nestjs/common';
import { GameRoomModule } from './game-room/game-room.module';
import { UserService } from './user/user.service';
import {SignalGateway} from "./signal/Signal.gateway";

@Module({
  imports: [GameRoomModule],
  controllers: [],
  providers: [UserService, SignalGateway],
})
export class AppModule {}
