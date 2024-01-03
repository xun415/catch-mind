import {describe, test, expect, vi, beforeEach} from "vitest";
import {render, screen } from "@testing-library/react";
import IndexForm from './index'
import {userEvent} from "@testing-library/user-event";

describe('인덱스 화면 form', () => {
    const onSubmitJoinRoom = vi.fn()
    const onSubmitCreateRoom = vi.fn()

    beforeEach(() => {
        onSubmitJoinRoom.mockReset()
        onSubmitJoinRoom.mockReset()
    })

    test('화면 요소 확인', () => {
        render(<IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />)

        const joinBtn = screen.getByText('참여하기')
        const createRoomBtn = screen.getByText('참여하기')
        expect(joinBtn).toBeInTheDocument()
        expect(createRoomBtn).toBeInTheDocument()
    })
    test('미입력 + 참여하기 시 에러 메세지 표시', async () => {
        render(<IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />)
        const joinBtn = screen.getByText('참여하기')

        await userEvent.click(joinBtn)

        expect(screen.getByText('닉네임을 입력해주세요')).toBeInTheDocument()
    })
    test('1글자 입력 + 참여하기 시 에러 메세지 표시', async () => {
        render(<IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />)
        const input = screen.getByLabelText('닉네임')

        await userEvent.type(input, '1')

        const joinBtn = screen.getByText('참여하기')

        await userEvent.click(joinBtn)

        expect(screen.getByText('닉네임은 2자 이상이여야 합니다.')).toBeInTheDocument()
    })
    test('15 글자 이상 입력 + 참여하기 시 에러 메세지 표시', async () => {
        render(<IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />)
        const input = screen.getByLabelText('닉네임')

        await userEvent.type(input, 'ㅁㄴㅇㅁㄴㅇㅁㄴㅇㄴㅁㅇㅁㄴㅇㅁㄴㅇㅁㄴㅇ')

        const joinBtn = screen.getByText('참여하기')

        await userEvent.click(joinBtn)

        expect(screen.getByText('닉네임은 15자 이하이여야 합니다.')).toBeInTheDocument()
    })

    test('적정 글자 이상 입력 + 참여하기 시 참여하기 함수 호출', async () => {
        render(<IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />)
        const input = screen.getByLabelText('닉네임')

        await userEvent.type(input, '닉네임')

        const joinBtn = screen.getByText('참여하기')

        await userEvent.click(joinBtn)

        expect(onSubmitJoinRoom).toBeCalled()
        expect(onSubmitCreateRoom).not.toBeCalled()
    })
    test('적정 글자 이상 입력 + 방만들기 시 방만들기 함수 호출', async () => {


        render(<IndexForm onSubmitJoinRoom={onSubmitJoinRoom} onSubmitCreateRoom={onSubmitCreateRoom} />)
        const input = screen.getByLabelText('닉네임')

        await userEvent.type(input, '닉네임')

        const createRoomBtn = screen.getByText('방만들기')

        await userEvent.click(createRoomBtn)

        expect(onSubmitJoinRoom).not.toBeCalled()
        expect(onSubmitCreateRoom).toBeCalled()
    })
})