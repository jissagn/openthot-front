"use client"

import getFormattedTime from "@/app/time-ago"
import { Box, IconButton, Card, CardBody, CardHeader, Container, Flex, Grid, GridItem, Heading, Text, Center, SimpleGrid, VisuallyHidden, VStack, Tooltip, Popover, PopoverTrigger, PopoverContent, PopoverBody } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import AudioPlayer from "./AudioPlayer";
import { MouseEvent, useContext, useRef } from "react";
import pad_time from "@/app/duration";
import { QuestionOutlineIcon } from "@chakra-ui/icons";




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

  function getTimeString(timeInSeconds: number | undefined | null): string {
    const tr_proc_minutes = Math.floor((timeInSeconds ?? 0) / 60);
    const tr_proc_seconds = ((timeInSeconds ?? 0) % 60); //.toFixed(3);
    const tr_proc_hours = Math.floor((tr_proc_minutes ?? 0) / 60);
    return pad_time(tr_proc_hours) + ':' + pad_time(tr_proc_minutes) + ':' + pad_time(tr_proc_seconds, 3)
  }

  const tsProcessingDuration = getTimeString(itw.transcript_duration_s);

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

    <><VStack>
      <Box w={"100%"}
        sx={{ position: 'sticky', top: '0', }} // , /* Safari */ position: 'sticky', top: '0', 
      >

        {params.with_player && (
          <AudioPlayer url={`/api/interviews/${itw.id}/audio`} waveformRef={waveform}></AudioPlayer>
        )}
      </Box>
      <Center><Heading fontSize={'2xl'}>{itw.name} </Heading>
        <Popover>
          <PopoverTrigger>
            <IconButton aria-label="more info" variant={"unstyled"} icon={<QuestionOutlineIcon />} />
          </PopoverTrigger>
          <PopoverContent>
            <PopoverBody> <Text>{itw.status} {getFormattedTime(itw.upload_ts)}</Text>
              {(itw.transcript_duration_s ?? 0) > 0 && (
                <Text>⚡ {tsProcessingDuration} avec {itw.transcript_source}</Text>
              )}</PopoverBody>
          </PopoverContent>
        </Popover>

      </Center>
      <Container maxW={"800"}>
        {itw.transcript && (
          <Grid
            gridTemplateColumns={'15% 85%'}
            columnGap={5}


          >
            {(() => {
              const rows = [];
              for (let i = 0; i < itw.transcript.segments.length; i++) {
                const segment = itw.transcript.segments[i];
                const previousSegment = i > 0 ? itw.transcript.segments[i - 1] : null;
                const rendered = (
                  <>
                    <GridItem></GridItem>
                    <GridItem>   {segment.speaker && (previousSegment == null || segment.speaker != previousSegment.speaker) &&
                      <Text marginTop={"6"} marginBottom={"1"} color={"gray"}>

                        {getTimeString(Math.round(segment.start))}</Text>}
                    </GridItem>
                    <GridItem textAlign={'right'}>
                      {segment.speaker && (previousSegment == null || segment.speaker != previousSegment.speaker) &&
                        <Text as="span" fontWeight={"extrabold"}>
                          {itw.speakers[segment.speaker]}
                        </Text>}
                      {!segment.speaker &&
                        <VisuallyHidden></VisuallyHidden>}

                    </GridItem>
                    <GridItem>
                      <Text>
                        {segment.words.map((word: SimpleWord) => (
                          <Text key={segment.id + "-" + word.word + "-" + word.start}
                            as="span"
                            color={word.probability < 0.2 ? getColor(word.probability) : ""}
                            onClick={(e) => { goTo(e, word.start / itw.audio_duration); }}>
                            {word.word}&ensp;
                          </Text>
                        )

                        )}
                      </Text>

                    </GridItem>
                  </>
                );
                rows.push(rendered);

              }
              return rows;
            })()}
          </Grid>
        )}
        {itw.status != "transcripted" && (
          <><Text>Pas encore de transcript (status: {itw.status})</Text></>
        )}
      </Container>
    </VStack></>
  )
};