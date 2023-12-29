import { Button, Flex, FormControl, FormErrorMessage, FormLabel, Input } from "@chakra-ui/react";
import { useForm } from "react-hook-form";
import { ErrorMessage } from "@hookform/error-message"

type Props = {
    onSubmitJoinRoom: (nickname: string) => void
    onSubmitCreateRoom: (nickname: string) => void
}

type FormValues = {
    nickname: string
}

const IndexForm = ({ onSubmitJoinRoom, onSubmitCreateRoom }: Props) => {
    const { register, formState: { errors }, handleSubmit } = useForm<FormValues>()

    // 닉네임 유효성 검증 완료 후
    const onSubmit = (data, event) => {
        const { nickname } = data

        /**
         * 참여하기 | 방만들기 버튼중 클릭된 버튼 알아내기
         * 각 버튼별로 별도의 이벤트 핸들러로 처리하는 대신, submit 버튼으로 처리하여 로직 공통화 후 구분.
         */
        const submitBtnType = event.nativeEvent.submitter.dataset.type
        const isJoinBtnClicked = submitBtnType === 'join'

        isJoinBtnClicked? onSubmitJoinRoom(nickname) : onSubmitCreateRoom(nickname)
    }

    return (
        <Flex
            as={'form'}
            onSubmit={handleSubmit(onSubmit)}
            boxShadow={'base'} borderRadius={'20px'} flexDirection={'column'} gap={4} padding={10} minW={240}
        >
            <FormControl text={'center'} isInvalid={errors.nickname !== undefined}>
                <FormLabel>닉네임</FormLabel>
                       {/* @ts-ignore */}
                <Input type={'text'} placeholder={'닉네임을 입력해주세요(2~15)'}
                       {...register('nickname', {
                           required: '닉네임을 입력해주세요',
                            minLength: {
                                value: 2,
                                message: '닉네임은 2자 이상이여야 합니다.'
                            },
                           maxLength: {
                                value: 15,
                               message:'닉네임은 15자 이하이여야 합니다.'
                           },
                })}/>
                <ErrorMessage errors={errors} name={'nickname'}
                    render={({ message }) => <FormErrorMessage>{message}</FormErrorMessage>}
                />
            </FormControl>
            <Button colorScheme={'green'} type={'submit'} data-type={'join'}>참여하기</Button>
            <Button colorScheme={'telegram'} type={'submit'} data-type={'create'}>방만들기</Button>
        </Flex>
    )
}

export default IndexForm