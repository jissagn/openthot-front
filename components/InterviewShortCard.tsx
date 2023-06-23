"use client"

import getFormattedTime from "@/app/time-ago"
import { Avatar, Badge, Box, Button, Card, CardBody, CardHeader, Center, Heading, Link, Stack, Text, useColorModeValue } from "@chakra-ui/react"
import { DeleteIcon } from '@chakra-ui/icons';
import { useRouter } from "next/navigation";
import AudioPlayer from "./AudioPlayer";
import { MouseEvent, useContext, useRef } from "react";
import pad_time from "@/app/duration";



export default function InterviewShortCard({
  params,
}: {
  params: {
    interview: InterviewData,
  };
}) {
  const router = useRouter();
  const itw = params.interview;
  // const nb_segments = itw.transcript?.segments.length ?? 1;
  const minutes = Math.floor(itw.audio_duration / 60);
  const seconds = (itw.audio_duration % 60); //.toFixed(3);
  const hours = Math.floor(minutes / 60);
  const duration = pad_time(hours) + ':' + pad_time(minutes) + ':' + pad_time(seconds, 3)
  // const speakers = itw.speakers.map(((itw: InterviewData) => ()));
  let nbSpeakers: number = 0;
  // let speakers: [[string]] = [[]];
  for (let key in itw.speakers) {
    // let speaker_label: string = itw.speakers[key];
    // const i = [key, speaker_label];
    // speakers.push(i);
    nbSpeakers += 1;
  }

  async function handleDelete(_: MouseEvent<HTMLButtonElement>) {
    const res = await fetch(`/api/interviews/${itw.id}`, {
      method: 'DELETE',
    });
    if (res.status == 200) {
      console.log(`Deleted ${itw.id}`)
      router.push("/interviews");

    } else {
      console.log(res.status)
      console.log(await res.json())
    }
  }

  return (
    <Center py={6}>
      <Box
        maxW={'480px'}
        w={'full'}
        bg={useColorModeValue('white', 'gray.900')}
        boxShadow={'2xl'}
        rounded={'lg'}
        p={6}
        textAlign={'center'}>

        <Heading fontSize={'2xl'} fontFamily={'body'}>
          {itw.name}
        </Heading>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          Créée {getFormattedTime(itw.upload_ts)}
        </Text>
        <Text fontWeight={600} color={'gray.500'} mb={4}>
          ⌛ {duration}
        </Text>

        {(itw.status == "transcripted" && nbSpeakers > 0) &&
          <Text fontWeight={600} color={'gray.500'} mb={4}>
            👥 {nbSpeakers} personnes
          </Text>}
        {itw.status != "transcripted" &&
          <Text fontWeight={600} color={'gray.500'} mb={4}>
            En cours de traitement
          </Text>
        }

        <Stack mt={8} direction={'row'} spacing={4}>
          <Link href={"/interviews/" + itw.id}>
            <Button
              flex={1}
              fontSize={'sm'}
              rounded={'full'}
            >
              Consulter
            </Button>
          </Link>
          <Button
            flex={1}
            fontSize={'sm'}
            rounded={'full'}
            maxW={1}
            colorScheme={'red'}
            boxShadow={
              '0px 1px 25px -5px rgb(225 66 33 / 48%), 0 10px 10px -5px rgb(255 66 33 / 43%)'
            }
            onClick={handleDelete}
          >
            <DeleteIcon />
          </Button>
        </Stack>
      </Box>
    </Center>
  );
};