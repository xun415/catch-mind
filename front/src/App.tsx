import { ChakraProvider } from "@chakra-ui/react"

function App({ children }) {

  return (
      <ChakraProvider>
        {children}
      </ChakraProvider>
  )
}

export default App
