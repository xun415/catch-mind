import { instance } from "@apis/config/axios";
import { AxiosResponse } from "axios";
import {Room, RoomConfig} from "../../types/data";

/**
 * 조회한 방의 참여 가능 여부를 조회합니다.
 *
 * @param roomId 조회할 방 아이디
 */
export async function getIsRoomFull(roomId: string): Promise<AxiosResponse<{ isFull: boolean }>> {
    return instance.get(`/api/rooms/${roomId}/is-full`)
}

type ServerRoom = Omit<Room, 'roomConfig'> & RoomConfig

/**
 * 조회한 방 정보를 조회합니다.
 *
 * @param roomId 조회할 방 아이디
 */
export async function room(roomId: string): Promise<AxiosResponse<{ room: ServerRoom }>> {
    return instance.get(`/api/rooms/${roomId}`)
}