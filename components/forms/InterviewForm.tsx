"use client"

import { FormLabel, FormControl, Input, Button } from "@chakra-ui/react";
// import { FormControl, Input, Button } from "chakra-ui";
import { useRouter } from "next/navigation";
import { SetStateAction, useState } from "react";

export default function InterviewForm({
    params,
}: {
    params: {
        default_name: string | null
    } | null;
}) {
    const [name, setName] = useState('');
    const [audio_file, setAudioFile] = useState<File | null>(null);
    const router = useRouter();
    const default_name = params?.default_name ? params.default_name : "Mon interview"

    function handleNameChange(e: { target: { value: SetStateAction<string>; }; }) {
        setName(e.target.value);
    }

    function handleAudioFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        if (e.target.files && e.target.files.length > 0) {
            setAudioFile(e?.target?.files[0]);
        }
    }

    async function handleSubmit(e: { preventDefault: () => void; }) {
        e.preventDefault();
        const formData = new FormData();
        formData.append('audio_file', audio_file ?? "");
        const url = "/api/interviews?" + new URLSearchParams({ name: name }).toString();
        // if (name) url += "?" + new URLSearchParams({ name: name }).toString();
        const res = await fetch(url, {
            method: 'POST',
            body: formData
        });
        if (res.status == 200) {
            const json = await res.json();
            console.log(json);
            const id = json.data.id
            const redirect = `/interviews/${id}`
            // TODO: ensure return code
            router.push(redirect);

        } else {
            console.error(res.status, res.json());
            console.error('Post failed.')

        }
    }
    return (<form onSubmit={handleSubmit}>
        <FormControl>
            <FormLabel>Fichier audio</FormLabel>
            <Input type='file' id='audio_file' onChange={handleAudioFileChange} />
        </FormControl>
        <FormControl>
            <FormLabel>Nom</FormLabel>
            <Input placeholder={default_name} id='name' onChange={handleNameChange} />
        </FormControl>
        <Button type="submit">Téléverser</Button>
    </form>)
};

