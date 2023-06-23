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
import { useRouter } from 'next/navigation';
import { SetStateAction, useState } from 'react';

export default function UserProfileForm({
    params,
}: {
    params: {
        email: string
    };
}): JSX.Element {


    const router = useRouter();
    const [password, setPassword] = useState<string | null>('');
    const [email, setEmail] = useState(params.email);


    function handleEmailChange(e: { target: { value: SetStateAction<string>; }; }) {
        const email = e.target.value ? e.target.value : params.email
        setEmail(email);
    }

    function handlePasswordChange(e: { target: { value: SetStateAction<string | null>; }; }) {
        const password = e.target.value ? e.target.value : null;
        setPassword(password);
    }

    async function handleCancel(_: any) {
        router.back()
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();

        const formData = new FormData();
        let payload = new Map();
        if (password) {
            payload.set('password', password);
            formData.append('password', password);
        }
        if (email && email != params.email) {
            payload.set('email', email);
            formData.append('email', email);
        };
        if (payload.size == 0) { console.info("No patch"); return };
        console.info("payload", JSON.stringify(Object.fromEntries(payload)))
        const res = await fetch(`/api/users/me`, {
            headers: {
                'Content-type': `application/json`,
            },
            method: 'PATCH',
            body: JSON.stringify(Object.fromEntries(payload))
        });
        const json = await res.json();
        if (res.status == 200) {
            // console.log(json);
            console.log("patched.")
            // router.push("/interviews");
            // TODO : just show confirmation message
        } else {
            console.error(res.status, json);
            // TODO: depending on response detail, say that the token 
            // must be provided by the "forgot password" page
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
                    <Heading lineHeight={1.1} fontSize={{ base: '2xl', sm: '3xl' }}>
                        Modifier ses informations
                    </Heading>

                    {/* <FormControl id="userName">
                        <FormLabel>User Icon</FormLabel>
                        <Stack direction={['column', 'row']} spacing={6}>
                            <Center>
                                <Avatar size="xl" src="https://bit.ly/sage-adebayo">
                                    <AvatarBadge
                                        as={IconButton}
                                        size="sm"
                                        rounded="full"
                                        top="-10px"
                                        colorScheme="red"
                                        aria-label="remove Image"
                                        icon={<SmallCloseIcon />}
                                    />
                                </Avatar>
                            </Center>
                            <Center w="full">
                                <Button w="full">Change Icon</Button>
                            </Center>
                        </Stack>
                    </FormControl>
                    <FormControl id="userName" isRequired>
                        <FormLabel>User name</FormLabel>
                        <Input
                            placeholder="UserName"
                            _placeholder={{ color: 'gray.500' }}
                            type="text"
                        />
                    </FormControl> */}
                    <FormControl id="email">
                        <FormLabel>E-mail</FormLabel>
                        <Input
                            placeholder={email}
                            _placeholder={{ color: 'gray.500' }}
                            type="email"
                            onChange={handleEmailChange}
                        />
                    </FormControl>
                    <FormControl id="password">
                        <FormLabel>Password</FormLabel>
                        <Input
                            placeholder="password"
                            _placeholder={{ color: 'gray.500' }}
                            type="password"
                            onChange={handlePasswordChange}
                        />
                    </FormControl>
                    <Stack spacing={6} direction={['column', 'row']}>
                        <Button
                            onClick={handleCancel}
                            colorScheme='red'
                            w="full">
                            Annuler
                        </Button>
                        <Button
                            type="submit"
                            colorScheme='blue'
                            w="full"
                        >
                            Mettre à jour
                        </Button>
                    </Stack>
                </Stack>
            </form>
        </Flex>
    );
}