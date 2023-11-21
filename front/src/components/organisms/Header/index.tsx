import { Center, Container, Text} from "@chakra-ui/react";

const Header = () => {
    return (
        <header>
            <Center h={'80px'} borderBottom={'1px solid gray'}>
                <Container p={'20px'} maxW={'1480px'}>
                    <Text as={'h1'} fontWeight={800}  >CATCH MIND</Text>
                </Container>
            </Center>
        </header>
    )
}

export default Header