import { ChakraProvider } from "@chakra-ui/react"
import Routes from '@routes/index'
import {SocketContextProvider} from "./contexts/socket";

function App() {

  return (
      <ChakraProvider>
          <SocketContextProvider>
            <Routes />
          </SocketContextProvider>
      </ChakraProvider>
  )
}

export default App
