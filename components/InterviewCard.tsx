"use client"

import getFormattedTime from "@/app/time-ago"
import { Box, Button, Card, CardBody, CardHeader, Container, Flex, Grid, GridItem, Heading, Text, Center } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import AudioPlayer from "./AudioPlayer";
import { MouseEvent, useContext, useRef } from "react";
import pad_time from "@/app/duration";
import { DeleteIcon } from "@chakra-ui/icons";




export default function InterviewCard({
  params,
}: {
  params: {
    interview: InterviewData,
    with_player: boolean
  };
}) {
  const router = useRouter();
  const itw = params.interview;
  const waveform = useRef<WaveSurfer | null>(null);

  const tr_proc_minutes = Math.floor((itw.transcript_duration_s ?? 0) / 60);
  const tr_proc_seconds = ((itw.transcript_duration_s ?? 0) % 60); //.toFixed(3);
  const tr_proc_hours = Math.floor((tr_proc_minutes ?? 0) / 60);
  const ts_proc_duration = pad_time(tr_proc_hours) + ':' + pad_time(tr_proc_minutes) + ':' + pad_time(tr_proc_seconds, 3)

  const nb_segments = itw.transcript?.segments.length ?? 1;

  function getColor(value: number) {
    //value from 0 to 1
    const hue = (value * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

  function goTo(_: MouseEvent<HTMLParagraphElement>, progress: number) {
    !waveform.current?.seekTo(progress)
    !waveform.current?.play()
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

    <Grid
      templateAreas={`"title title title"
                  "audioreader audioreader audioreader"
                  "details transcript transcript"
                  "footer transcript transcript"`}
      // gridTemplateRows={'200px'}
      gridTemplateColumns={'300px 1fr'}
      gap='1'
    >
      <GridItem area={'title'}>
        <Center>
          {/* <Heading fontSize={'2xl'}>{itw.name} (#{itw.id}) </Heading >&ensp; */}
          {/* <Button
            // flex={1}

            fontSize={'sm'}
            // rounded={'full'}
            maxW={1}
            colorScheme={'red'}
            onClick={handleDelete}
          >
            <DeleteIcon />
          </Button> */}
        </Center>
      </GridItem>
      <GridItem area={'audioreader'}>
        {params.with_player && (
          <AudioPlayer url={`/api/interviews/${itw.id}/audio`} waveformRef={waveform}></AudioPlayer>
        )}
      </GridItem>
      <GridItem area={'details'}>

        <Card colorScheme="gray">
          <CardHeader><Heading fontSize={'2xl'}>{itw.name} </Heading ></CardHeader>

          <Text>{itw.audio_location}</Text>
          <CardBody>
            <Text>{itw.status} {getFormattedTime(itw.upload_ts)}</Text>
            {(itw.transcript_duration_s ?? 0) > 0 && (
              <Text>⚡ {ts_proc_duration} avec {itw.transcript_source}</Text>
            )}
          </CardBody>
        </Card>
      </GridItem>
      <GridItem area={'transcript'}>


        <Card>
          <CardBody>
            {itw.transcript && (
              <>
                {(() => {
                  const rows = [];
                  for (let i = 0; i < itw.transcript.segments.length; i++) {
                    const segment = itw.transcript.segments[i];
                    const previousSegment = i > 0 ? itw.transcript.segments[i - 1] : null;
                    const rendered = (
                      <span key={segment.id}>
                        {segment.speaker && (previousSegment == null || segment.speaker != previousSegment.speaker) && <Text as="span" fontWeight={"extrabold"} >{itw.speakers[segment.speaker]} </Text>}
                        <Text pl={6}>
                          {segment.words.map((word: SimpleWord) => (
                            <Text key={segment.id + "-" + word.word + "-" + word.start}
                              as="span"
                              color={word.probability < 0.3 ? getColor(word.probability) : ""}
                              onClick={(e) => { goTo(e, word.start / itw.audio_duration) }}>
                              {word.word}&ensp;
                            </Text>
                          )

                          )}
                        </Text>
                      </span>)
                    rows.push(rendered)
                  }
                  return rows;
                })()}
              </>
            )}
            {itw.status != "transcripted" && (
              <><Text>Pas encore de transcript (status: {itw.status})</Text></>
            )}
          </CardBody></Card>


      </GridItem>
      {/* <GridItem area={'footer'}></GridItem> */}
    </Grid>

  )
};