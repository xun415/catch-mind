import { ChakraProvider } from "@chakra-ui/react"
import Routes from '@routes/index'
import {SocketContextProvider} from "./contexts/socket";
import {UserContextProvider} from "@contexts/user/UserContext";
import {StreamContextProvider} from "@contexts/stream";

function App() {

  return (
      <ChakraProvider>
              <SocketContextProvider>
                  <StreamContextProvider>
                      <UserContextProvider>
                          <Routes />
                      </UserContextProvider>
                  </StreamContextProvider>
              </SocketContextProvider>
      </ChakraProvider>
  )
}

export default App
