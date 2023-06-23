"use client"

import {
    Flex,
    Container,
    Heading,
    Stack,
    Text,
    Button,
    Center,
    useColorModeValue,
    VStack,
    useColorMode,
} from '@chakra-ui/react';
import Image from 'next/image'
import thotDark from '@/asset/thot.512px.dark.png'
import thotLight from '@/asset/thot.512px.light.png'
import { useRouter } from 'next/navigation';
import { MoonIcon, SunIcon } from '@chakra-ui/icons';

export default function Hero() {

    const { colorMode, toggleColorMode } = useColorMode();
    const router = useRouter()
    function handleLogin(_: any) {
        router.push("/login?redirect=/interviews")
    }

    return (

        <Container maxW={'5xl'}>
            <Button variant={"ghost"} onClick={toggleColorMode}>
                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
            </Button>
            <Stack
                textAlign={'center'}
                align={'center'}
                spacing={{ base: 8, md: 10 }}
                py={{ base: 20, md: 28 }}>
                <Heading
                    fontWeight={600}
                    fontSize={{ base: '3xl', sm: '4xl', md: '4xl' }}
                    lineHeight={'110%'}>
                    Transcripteur d&rsquo;interviews{' '}
                    <Text as={'span'} color='teal'>
                        automatique
                    </Text>
                </Heading>
                <Text color={'gray.500'} maxW={'3xl'}>
                    OpenThot retranscrit vos interviews pour vous faire gagner du temps. Basé sur Whisper, WhisperX, etc (à compléter et sourcer)
                </Text>
                <Stack spacing={6} direction={'row'}>
                    <Button
                        rounded={'full'}
                        px={6}
                        >
                        Créer un compte
                    </Button>
                    <Button rounded={'full'} px={6}  colorScheme={'teal'} onClick={handleLogin}>
                        Voir mes interviews
                    </Button>
                </Stack>
                <VStack spacing={1} direction={'column'}>
                    <Image src={useColorModeValue(thotLight, thotDark)} alt='Thot' width={256} height={256}></Image>
                    <Heading
                        fontSize={{ base: '3xl', sm: '4xl', md: '4xl' }}
                        color={'teal'}>OpenThot</Heading>
                </VStack>
            </Stack>
        </Container>
    );
}
