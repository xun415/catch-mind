import { Test, TestingModule } from '@nestjs/testing';
import { GameRoomController } from './game-room.controller';
import {GameRoomService} from "./game-room.service";
import {NotFoundException} from "@nestjs/common";
import {GameRoom} from "./game-room.interface";
import {jest} from '@jest/globals'

const mockRoom: GameRoom = {
  id: '123',
  drawPlayer: null,
  currentRound: 1,
  timePerRound: 180,
  totalRound: 3,
  players: [],
  sessions: [],
  maxPlayerNumber: 4
}

describe('GameRoomController', () => {
  let controller: GameRoomController;
  let service: GameRoomService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [GameRoomController],
      providers: [GameRoomService]
    }).compile();

    controller = module.get<GameRoomController>(GameRoomController);
    service = module.get<GameRoomService>(GameRoomService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getRoom - id 찾을 수 없을 경우 404 에러', () => {
    try {
      // act
       controller.getRoom('1')
    } catch (e) {
      // assert
      expect(e).toBeInstanceOf(NotFoundException)
    }
  })

  it('getRoom - id 찾은 경우 GameRoom 리턴', () => {
    // arrange
    jest.spyOn(service, 'findOneById')
        .mockReturnValue(mockRoom)

    // act
    const result = controller.getRoom('123')

    // assert
    expect(result).toEqual(mockRoom)
  })

  it('getIsRoomFull - id 찾을 수 없을 경우 404 에러', () => {
    try {
      // act
      controller.getIsRoomFull('1')
    } catch (e) {
      // assert
      expect(e).toBeInstanceOf(NotFoundException)
    }
  })

  it('getIsRoomFull - 찾은 경우 isFull 리턴', () => {
    // arrange
    jest.spyOn(service, 'findOneById')
        .mockReturnValue(mockRoom)

    // act
    const result = controller.getIsRoomFull('1')

    // assert
    expect(result).toHaveProperty('isFull')
  })

  it('getIsRoomFull - 방이 가득 찬 경우 isFull === true', () => {
    // arrange
    jest.spyOn(service, 'findOneById')
        .mockReturnValue({
          ...mockRoom,
          players: Array.from({length: 4}),
          maxPlayerNumber: 4
        })

    // act
    const result = controller.getIsRoomFull('1')

    // assert
    expect(result).toHaveProperty('isFull')
    expect(result.isFull).toBe(true)
  })

  it('getIsRoomFull - 방이 빈 경우 isFull === false', () => {
    // arrange
    jest.spyOn(service, 'findOneById')
        .mockReturnValue({
          ...mockRoom,
          players: [],
          maxPlayerNumber: 4
        })

    // act
    const result = controller.getIsRoomFull('1')

    // assert
    expect(result).toHaveProperty('isFull')
    expect(result.isFull).toBe(false)
  })

});
