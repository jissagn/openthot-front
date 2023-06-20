"use client"

import getFormattedTime from "@/app/time-ago"
import { Button, Card, CardBody, CardHeader, Heading, Text } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import AudioPlayer from "./AudioPlayer";
import { MouseEvent, useContext, useRef } from "react";




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
  const nb_segments = itw.transcript?.segments.length ?? 1;
  const audioDuration = itw.transcript?.segments[nb_segments - 1]?.end ?? 1;
  // console.log(`nb_segments ${nb_segments}`);
  // console.log(`audioDuration ${audioDuration}`);

  function getColor(value: number) {
    //value from 0 to 1
    const hue = (value * 120).toString(10);
    return ["hsl(", hue, ",100%,50%)"].join("");
  }

  function goTo(_: MouseEvent<HTMLParagraphElement>, progress: number) {
    !waveform.current?.seekTo(progress)
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

  return (<Card>
    <CardHeader>
      <Heading>{itw.name} (#{itw.id})</Heading>
      <Button onClick={handleDelete}>❌ Supprimer</Button>
    </CardHeader>
    <Text>{itw.audio_location}</Text>
    {params.with_player && (
      <AudioPlayer url={`/api/interviews/${itw.id}/audio`} waveformRef={waveform}></AudioPlayer>
    )}
    <CardBody>
      <Heading>{itw.status}</Heading>
      <Text>{getFormattedTime(itw.upload_ts)}</Text>
      {(itw.transcript_duration_s ?? 0) > 0 && (
        <Text>en {itw.transcript_duration_s} secondes avec {itw.transcript_source}</Text>
      )}
      {itw.transcript && (
        <><Heading>Transcript {itw.transcript?.language}</Heading>
          {itw.transcript.segments.map((segment: SimpleSegment) => (
            <span key={segment.id}>
              {segment.speaker && <Text as="span" fontWeight={"extrabold"} >{segment.speaker} </Text>}
              <Text>
                {segment.words.map((word: SimpleWord) => (
                  <Text key={word.start}
                    as="span"
                    color={word.probability < 0.3 ? getColor(word.probability) : ""}
                    // {word.probability < 0.3 && (color=getColor(word.probability))}
                    onClick={(e) => { goTo(e, word.start / audioDuration) }}>
                    {word.word}&#8239;
                  </Text>
                )

                )}
              </Text>
            </span>
          ))}
        </>
      )}
      {itw.status != "transcripted" && (
        <><Text>Pas encore de transcript (status: {itw.status})</Text></>
      )}
      

    </CardBody>
  </Card>)
};