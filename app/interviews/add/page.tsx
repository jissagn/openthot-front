"use client"

import { redirect, useRouter } from 'next/navigation';
import { useState } from 'react';

import FormControl from '@/components/FormControl';
// import FormHelperText from '@/components/FormHelperText';
import FormLabel from '@/components/FormLabel';
import Input from '@/components/input';
import Flex from '@/components/flex';
import Button from '@/components/button';


export default function Login() {
    const [name, setName] = useState('');
    const [audio_file, setAudioFile] = useState('');
    const router = useRouter();

    function handleNameChange(e) {
        setName(e.target.value);
    }

    function handleAudioFileChange(e) {
        setAudioFile(e.target.files[0]);
    }

    async function handleSubmit(e) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('audio_file', audio_file);
        const res = await fetch(`/api/interviews?` + new URLSearchParams({ name: name }).toString(), {  
            method: 'POST',
            body: 
            formData
        });
        if (res.status == 200) {
            const json = await res.json();
            console.log("prout");
            console.log(json);
            const id = json.data.id
            const redirect = `/interviews/${id}`
            // TODO: ensure return code
            router.push(redirect);

        } else {
            console.log(res.status);
            console.log(res.json());
            console.error('Post failed.')

        }
    }

    return (
        // <>
        <Flex>
            <form onSubmit={handleSubmit}>
                <FormControl isRequired>
                    <FormLabel>Nom</FormLabel>
                    <Input placeholder={`Mon interview`} id='name' onChange={handleNameChange}/>
                </FormControl>
                <FormControl>
                    <FormLabel>Fichier audio</FormLabel>
                    <Input type='file' id='audio_file' onChange={handleAudioFileChange}/>
                </FormControl>
                <Button type="submit">Téléverser</Button>
            </form>
            </Flex>
        // </>
    )
}