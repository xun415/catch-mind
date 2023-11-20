import { ChakraProvider } from "@chakra-ui/react"
import Routes from '@routes/index'

function App({ children }) {

  return (
      <ChakraProvider>
          <Routes />
      </ChakraProvider>
  )
}

export default App
