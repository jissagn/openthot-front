
"use client"


import Image from 'next/image'
import { AbsoluteCenter, Box, Container, Flex, HStack, Text, VStack, useColorModeValue } from "@chakra-ui/react"
import { relative } from "path"
import feather from '@/asset/feather.32px.png'
import soundWave from '@/asset/sound-waves.32px.png'
import thotDark from '@/asset/thot.512px.dark.png'
import thotLight from '@/asset/thot.512px.light.png'
export default function Footer() {

    return (
        <Box py={10}>
            <Flex
                align={'center'}
                _before={{
                    content: '""',
                    borderBottom: '1px solid',
                    borderColor: useColorModeValue('gray.200', 'gray.700'),
                    flexGrow: 1,
                    mr: 8,
                }}
                _after={{
                    content: '""',
                    borderBottom: '1px solid',
                    borderColor: useColorModeValue('gray.200', 'gray.700'),
                    flexGrow: 1,
                    ml: 8,
                }}>
                {/* <Image src={soundWave} alt='Soundwave logo' width={20} height={20}></Image>
                <Image src={feather} alt='Feather logo' width={20} height={20}></Image> */}
                <Image src={useColorModeValue(thotLight, thotDark)} alt='OpenThot logo' width={16} height={16}></Image>
            </Flex>

            {/* <Text pt={6} fontSize={'sm'} textAlign={'center'}>
                <a href="https://www.flaticon.com/free-icons/sound-waves" title="sound waves icons">
                    Sound waves icons created by kornkun - Flaticon</a>
            </Text>
            <Text fontSize={'sm'} textAlign={'center'}>
                <a href="https://www.flaticon.com/free-icons/feather" title="feather icons">
                    Feather icons created by Pixel perfect - Flaticon</a>
            </Text> */}

            <Text fontSize={'xs'} textAlign={'center'} p={3}>
            <a href="https://www.flaticon.com/free-icons/thot" title="thot icons">
                Thot icons created by Freepik - Flaticon</a>
                </Text>

        </Box>
    )
}