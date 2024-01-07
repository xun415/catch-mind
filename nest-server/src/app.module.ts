import { Module } from '@nestjs/common';
import { GameRoomModule } from './game-room/game-room.module';
import { UserService } from './user/user.service';

@Module({
  imports: [GameRoomModule],
  controllers: [],
  providers: [UserService],
})
export class AppModule {}
