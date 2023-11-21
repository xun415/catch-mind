import { ChakraProvider } from "@chakra-ui/react"
import Routes from '@routes/index'
import {SocketContextProvider} from "./contexts/socket";
import {UserContextProvider} from "@contexts/user/UserContext";

function App() {

  return (
      <ChakraProvider>
              <SocketContextProvider>
                  <UserContextProvider>
                      <Routes />
                  </UserContextProvider>
              </SocketContextProvider>
      </ChakraProvider>
  )
}

export default App
