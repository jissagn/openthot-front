// app/providers.tsx
'use client'

import { CacheProvider } from '@chakra-ui/next-js'
import { ChakraProvider } from '@chakra-ui/react'
// import extendTheme from "@/app/theme/theme"
  
export function Providers({ 
    children 
  }: { 
  children: React.ReactNode 
  }) {
  return (
    <CacheProvider>
      <ChakraProvider /*theme={extendTheme}*/> 
        {children}
      </ChakraProvider>
    </CacheProvider>
  )
}