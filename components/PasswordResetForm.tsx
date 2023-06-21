// FROM https://chakra-templates.dev/forms/authentication
"use client"

import {
    Button,
    Flex,
    FormControl,
    FormLabel,
    Heading,
    Input,
    Stack,
    useColorModeValue,
} from '@chakra-ui/react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';

export default function ResetPasswordForm(): JSX.Element {

    const [password, setPassword] = useState('');
    const router = useRouter();

    const searchParams = useSearchParams();
    const resetToken = searchParams.get("resetToken") ?? "resetToken";

    function handlePasswordChange(e: { target: { value: SetStateAction<string>; }; }) {
        setPassword(e.target.value);
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const res = await fetch(`/api/auth/reset-password`, {
            headers: { 'Content-type': `application/json` },
            method: 'POST',
            body: JSON.stringify({ 'password': password, 'token': resetToken })
        });
        if (res.status == 200) {
            const json = await res.json();
            console.log(json);
            router.push("/interviews");
        } else {
            console.log(res.status);
            console.log(await res.json());
            console.error('Password reset failed.')
            // TODO: say that the token must be provided by the "forgot password" page
            // according to response detail
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
                        Nouveau mot de passe
                    </Heading>
                    {/* <FormControl id="email" isRequired>
                        <FormLabel>Adresse email</FormLabel>
                        <Input
                            placeholder="your-email@example.com"
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                        />
                    </FormControl> */}
                    <FormControl id="password" isRequired>
                        <FormLabel>Mot de passe</FormLabel>
                        <Input type="password" onChange={handlePasswordChange} />
                    </FormControl>
                    <Stack spacing={6}>
                        <Button
                            type="submit"
                            bg={'blue.400'}
                            color={'white'}
                            _hover={{
                                bg: 'blue.500',
                            }}>
                            Changer mot de passe
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Flex>
    );
}