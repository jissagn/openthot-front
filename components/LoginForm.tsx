// FROM https://chakra-templates.dev/forms/authentication
"use client"

import {
    Flex,
    Box,
    FormControl,
    FormLabel,
    Input,
    Stack,
    Link,
    Button,
    Heading,
    useColorModeValue,
} from '@chakra-ui/react';

import { SetStateAction, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSearchParams } from 'next/navigation';
import NextLink from 'next/link'

export default function LoginForm() {

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const router = useRouter();
    const redirect = useSearchParams().get('redirect');

    function handleEmailChange(e: { target: { value: SetStateAction<string>; }; }) {
        setEmail(e.target.value);
    }

    function handlePasswordChange(e: { target: { value: SetStateAction<string>; }; }) {
        setPassword(e.target.value);
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('username', email);
        formData.append('password', password);
        const res = await fetch(`/api/login`, {
            method: 'POST',
            body: formData
        });
        const json = await res.json();
        if (res.status == 200) {
            console.log(json);
            if (redirect) {
                router.push(redirect);
            }
            else {
                router.push("/");
            }
        } else {
            console.error(res.status, json);
        }
    }

    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>
            <Stack spacing={8} mx={'auto'} maxW={'lg'} py={12} px={6}>
                <Stack align={'center'}>
                    <Heading fontSize={'4xl'}>Connectez-vous</Heading>
                    {/* <Text fontSize={'lg'} color={'gray.600'}>
                        to enjoy all of our cool <Link color={'blue.400'}>features</Link> ✌️
                    </Text> */}
                </Stack>
                <Box
                    rounded={'lg'}
                    bg={useColorModeValue('white', 'gray.700')}
                    boxShadow={'lg'}
                    p={8}>
                    <Stack spacing={4}>
                        <form onSubmit={handleSubmit}>
                            <FormControl id="email">
                                <FormLabel>Adresse e-mail</FormLabel>
                                <Input type="email" onChange={handleEmailChange} />
                            </FormControl>
                            <FormControl id="password">
                                <FormLabel>Mot de passe</FormLabel>
                                <Input type="password" onChange={handlePasswordChange} />
                            </FormControl>
                            <Stack spacing={10}>
                                <Stack
                                    direction={{ base: 'column', sm: 'row' }}
                                    align={'start'}
                                    justify={'space-between'}>
                                    {/* <Checkbox>Se souvenir de moi</Checkbox> */}
                                    <Link color={'blue.400'} as={NextLink} href='/login/reset'>Mot de passe oublié ?</Link>
                                </Stack>
                                <Button
                                    type="submit"
                                    bg={'blue.400'}
                                    color={'white'}
                                    _hover={{
                                        bg: 'blue.500',
                                    }}>
                                    Connexion
                                </Button>
                            </Stack>
                        </form>
                    </Stack>
                </Box>
            </Stack>
        </Flex>
    );
}
