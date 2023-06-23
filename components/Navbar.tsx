"use client"

import { ReactNode } from 'react';

import Image from 'next/image'
import {
    Box,
    Flex,
    Avatar,
    Link,
    Button,
    Menu,
    MenuButton,
    MenuList,
    MenuItem,
    MenuDivider,
    useDisclosure,
    useColorModeValue,
    Stack,
    useColorMode,
    Center,
    HStack,
    Text,
    textDecoration
} from '@chakra-ui/react';
import feather from '@/asset/feather.32px.png'
import soundWave from '@/asset/sound-waves.32px.png'
import thotDark from '@/asset/thot.512px.dark.png'
import thotLight from '@/asset/thot.512px.light.png'
import { MoonIcon, SunIcon, EditIcon, UnlockIcon, ChevronDownIcon, AddIcon, HamburgerIcon } from '@chakra-ui/icons';
import { useRouter } from 'next/navigation';
import NextLink from 'next/link'


const Links = ['Interviews'];
const NavLink = ({ dest, children }: { dest: string, children: ReactNode }) => (
    <Link href={'/' + dest.toLowerCase()}>
        <Button
            variant={'ghost'}
            colorScheme={'teal'}
            // size={''}
            // mr={4}
            leftIcon={<HamburgerIcon />}
        >

            {children}
        </Button></Link>
);

export default function Nav({
    children,
}: {
    children: React.ReactNode
}) {
    const { colorMode, toggleColorMode } = useColorMode();
    const { isOpen, onOpen, onClose } = useDisclosure();


    const router = useRouter();
    async function goUser(_: any) {
        router.push("/me")
    }

    async function handleLogout(_: any) {
        const res = await fetch(`/api/auth/jwt/logout`, {
            method: 'POST',
        });
        if (res.status >= 200 && res.status < 300) {
            console.log(`Logged out!`)
            router.push("/");

        } else {
            const json = res.json()
            console.error(res.status, json)
        }
    }

    return (
        <>
            <Box bg={useColorModeValue('gray.100', 'gray.900')} px={4}>
                <Flex h={16} alignItems={'center'} justifyContent={'space-between'}>
                    <Box>
                    <Link href='/'>
                                <Button
                                    variant={'ghost'}
                                    colorScheme={'black'}
                                    // size={'sm'}
                                    mr={4}
                                    leftIcon={<Image src={useColorModeValue(thotLight, thotDark)} alt='OpenThot logo' width={24} height={24}></Image>}>
                                    OpenThot
                                </Button></Link>
                        {/* <Link href='/' _hover={{textDecoration: 'none', bg:'teal'}}>
                        <Stack direction={'row'} spacing={1}>
                            <Image src={soundWave} alt='Soundwave logo' width={24} height={24}></Image>
                            <Image src={feather} alt='Feather logo' width={24} height={24}></Image>
                            <Image src={thot} alt='OpenThot logo' width={24} height={24}></Image>
                            <Text>OpenThot</Text>
                        </Stack>
                        </Link> */}
                        </Box>
                    {/* <Box></Box> */}
                    <HStack spacing={8} alignItems={'center'}>
                        <HStack
                            as={'nav'}
                            spacing={4}
                            display={{ base: 'flex', md: 'flex' }}>
                            {Links.map((link) => (
                                <NavLink key={link} dest={link}>{link}</NavLink>
                            ))}
                            <Link href='/interviews/new'>
                                <Button
                                    variant={'solid'}
                                    colorScheme={'teal'}
                                    // size={'sm'}
                                    // mr={4}
                                    leftIcon={<AddIcon />}>
                                    Nouvelle interview
                                </Button></Link>
                        </HStack>
                    </HStack>
                    <Flex alignItems={'center'}>
                        <Stack direction={'row'} spacing={1}>
                            <Button onClick={toggleColorMode}>
                                {colorMode === 'light' ? <MoonIcon /> : <SunIcon />}
                            </Button>

                            <Menu>
                                <MenuButton
                                    as={Button}
                                    rounded={'md'}
                                    variant={'solid'}
                                    cursor={'pointer'}
                                    minW={0}
                                    rightIcon={<ChevronDownIcon />}>
                                    Profil
                                </MenuButton>
                                <MenuList alignItems={'center'} >
                                    <MenuItem icon={<EditIcon />} onClick={goUser}>Modifier profil</MenuItem>
                                    <MenuItem icon={<UnlockIcon />} onClick={handleLogout}>Déconnexion</MenuItem>
                                </MenuList>
                            </Menu>
                        </Stack>
                    </Flex>
                </Flex>
            </Box>

            <Box p={4}>{children}</Box>
        </>
    );
}