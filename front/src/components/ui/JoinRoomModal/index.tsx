import {
    Button, FormControl, FormErrorMessage, FormLabel, Input, Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
} from "@chakra-ui/react";
import {ChangeEventHandler, useState} from "react";

type Props = {
    isOpen: boolean
    onClose: () => void
    errorMessage?: string
    onSubmitRoomId: (roomId: string) => void
    onChangeInputValue: () => void
}

const JoinRoomModal = ({ isOpen, onClose, onSubmitRoomId, errorMessage, onChangeInputValue }: Props) => {
    const [roomId, setRoomId] = useState('')

    const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
        setRoomId(event.target.value)
        onChangeInputValue()
    }

    const isError: boolean = errorMessage?.length ? errorMessage.length > 0 : false

    const onClickJoin = () => {
        onSubmitRoomId(roomId)
    }

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <ModalOverlay />
            <FormControl isInvalid={isError}>
                <ModalContent>
                    <ModalHeader>Modal Title</ModalHeader>
                    <ModalCloseButton />
                    <ModalBody>
                        <FormLabel>게임방 아이디</FormLabel>
                        <Input placeholder={'게임방 아이디를 입력해주세요'} value={roomId} onChange={handleChange}/>
                        <FormErrorMessage>{errorMessage?? ''}</FormErrorMessage>
                    </ModalBody>

                    <ModalFooter>
                        <Button colorScheme='red' mr={3} onClick={onClose}>
                            Close
                        </Button>
                        <Button colorScheme={'green'} onClick={onClickJoin}>참여하기</Button>
                    </ModalFooter>
                </ModalContent>
            </FormControl>
        </Modal>
    )
}

export default JoinRoomModal