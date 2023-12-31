import {FormControl, FormLabel, Select, VStack, Heading, Button} from "@chakra-ui/react";
import {ChangeEvent} from "react";
import {RoomConfig} from "../../../types/data";
import {COLOR} from "@assets/styles/color.css";

const ROUND_OPTION = [1,2,3,4]

const PLAYER_LIMIT_OPTION = [1,2,3,4]

const ROUND_TIME_OPTION = [60, 70, 80, 90, 100, 110, 120, 140, 160, 180]

type Props = {
    isRoomHost: boolean
    onOptionChange: (newOption: { key: keyof RoomConfig, value: number }) => void
    roomConfig: RoomConfig
    onClickStartGame: () => void
}
const GameSetting = ({ isRoomHost, onOptionChange, roomConfig, onClickStartGame }:Props) => {

    const onChangeRoomConfigOption = (event: ChangeEvent<HTMLSelectElement>, subject: keyof RoomConfig) => {
        const newValue = Number(event.target.value)
        onOptionChange({ key: subject, value: newValue })
    }
    console.log('isRoomHost: ', isRoomHost)
    /**
     * [게임 설정]
     *
     * - 설정 목록
     * 총 라운드: totalRound
     * 참여자 수: maxPlayerNumber
     * 라운드 시간: timePerRound
     *
     * - 하단
     * 게임 시작 버튼
     *
     *
     * todo
     * - 방장만 옵션 조작 가능하도록 설정
     *
     * - 옵션 변경 시 socket.emit 으로 플레이어들에게 업데이트
     *
     * - 게임 시작 시 socket.emit 으로 게임 시작 이벤트
     *
     * - 초기 진입시 api 조회로 세팅, 이후 이벤트로 캐치 후 변경. 비동기 로직으로 폼 요소를 변경해야하므로 state로 관리
     *
     */
    return (
        <VStack w={'360px'} p={10} borderRadius={'xl'}>
            <Heading as='h3' size='lg'>
                게임 설정
            </Heading>
            <FormControl>
                <FormLabel>총 라운드</FormLabel>
                <Select
                    placeholder='총 라운드'
                    isDisabled={!isRoomHost}
                    value={roomConfig.totalRound}
                    onChange={event => onChangeRoomConfigOption(event, 'totalRound')}
                >
                    <>
                        {
                            ROUND_OPTION.map((option) =>
                                <option
                                    key={`round_cnt_option_${option}`}
                                    value={option}
                                >
                                    {option+'라운드'}
                                </option>)
                        }
                    </>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>참가 인원</FormLabel>
                <Select placeholder='참가인원' value={roomConfig.maxPlayerNumber} isDisabled={!isRoomHost} onChange={event => onChangeRoomConfigOption(event, 'maxPlayerNumber')}>
                    <>
                        {
                            PLAYER_LIMIT_OPTION.map((option) =>
                                <option
                                    key={`player_limit_option_${option}`}
                                    value={option}
                                >
                                    {option+'명'}
                                </option>)
                        }
                    </>
                </Select>
            </FormControl>
            <FormControl>
                <FormLabel>라운드 제한 시간</FormLabel>
                <Select
                    placeholder='제한 시간'
                    value={roomConfig.timePerRound}
                    onChange={event => onChangeRoomConfigOption(event, 'timePerRound')}
                    isDisabled={!isRoomHost}
                >
                    <>
                        {
                            ROUND_TIME_OPTION.map((option) =>
                                <option
                                    key={`player_limit_option_${option}`}
                                    value={option}
                                >
                                    {option+'초'}
                                </option>)
                        }
                    </>
                </Select>
            </FormControl>
            <>
                {
                    isRoomHost? <Button w={'100%'} colorScheme={'blue'} onClick={onClickStartGame}>게임 시작</Button> : null
                }
            </>
        </VStack>
    )
}

export default GameSetting