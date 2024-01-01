import {FormControl, FormLabel, Select, VStack, Heading, Button} from "@chakra-ui/react";
import {ChangeEvent} from "react";
import {RoomConfig} from "../../../types/data";

const ROUND_OPTION = [1,2,3,4]

const PLAYER_LIMIT_OPTION = [2,3,4]

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
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => onChangeRoomConfigOption(event, 'totalRound')}
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
                <Select placeholder='참가인원' value={roomConfig.maxPlayerNumber} isDisabled={!isRoomHost} onChange={(event: ChangeEvent<HTMLSelectElement>) => onChangeRoomConfigOption(event, 'maxPlayerNumber')}>
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
                    onChange={(event: ChangeEvent<HTMLSelectElement>) => onChangeRoomConfigOption(event, 'timePerRound')}
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