// FROM https://chakra-templates.dev/forms/authentication
"use client"

import {
    Button,
    FormControl,
    Flex,
    Heading,
    Input,
    Stack,
    Text,
    useColorModeValue,
} from '@chakra-ui/react';
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';


export default function ForgotPasswordForm(): JSX.Element {


    const [email, setEmail] = useState('');
    const router = useRouter();

    function handleEmailChange(e: { target: { value: SetStateAction<string>; }; }) {
        setEmail(e.target.value);
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const res = await fetch(`/api/auth/forgot-password`, {
            headers: { 'Content-type': `application/json` },
            method: 'POST',
            body: JSON.stringify({ 'email': email })
        });
        if (res.status == 202) {
            const json = await res.json();
            console.log(json);
            router.push("/login");

        } else {
            console.log(res.status);
            console.log(res.json());
            console.error('Reset password failed.')

        }
    }
    return (
        <Flex
            minH={'100vh'}
            align={'center'}
            justify={'center'}
            bg={useColorModeValue('gray.50', 'gray.800')}>

            <form onSubmit={handleSubmit}>
                <Stack
                    spacing={4}
                    w={'full'}
                    maxW={'md'}
                    bg={useColorModeValue('white', 'gray.700')}
                    rounded={'xl'}
                    boxShadow={'lg'}
                    p={6}
                    my={12}>
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', md: '3xl' }}>
                        Mot de passe oublié ?
                    </Heading>
                    <Text
                        fontSize={{ base: 'sm', sm: 'md' }}
                        color={useColorModeValue('gray.800', 'gray.400')}>
                        Vous recevrez un e-mail avec un lien pour choisir un nouveau mot de passe
                    </Text>

                    <FormControl id="email" isRequired>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            onChange={handleEmailChange}
                            
                        />
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            type="submit"
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Demander la réinitialisation
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Flex>
    );
}