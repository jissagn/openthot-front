// FROM https://tabsoverspaces.in/posts/create-a-audio-player-in-nextjs/
// AND  https://blog.logrocket.com/building-audio-player-react/

"use client"
import { Button, Flex } from "@chakra-ui/react";
import { MutableRefObject, RefObject, useEffect, useRef } from "react";
import Wavesurfer from "wavesurfer.js";

export default function AudioPlayer({ url, waveformRef }: { url: string, waveformRef: MutableRefObject<WaveSurfer | null> }) {
    // const waveform = useRef<WaveSurfer | null>(null);

    useEffect(() => {
        // Check if wavesurfer object is already created.
        if (!waveformRef.current) {
            // Create a wavesurfer object
            // More info about options here https://wavesurfer-js.org/docs/options.html
            waveformRef.current = Wavesurfer.create({
                container: "#waveform",
                waveColor: "#567FFF",
                barGap: 2,
                barWidth: 3,
                barRadius: 3,
                cursorWidth: 3,
                cursorColor: "#567FFF",
            });

            // Load audio from a remote url.
            waveformRef.current.load(url);
            // waveform.current.seekTo
        }

    }, [url, waveformRef]);

    const playAudio = () => {
        // Check if the audio is already playing
        if (waveformRef.current?.isPlaying()) {
            waveformRef.current.pause();
        } else {
            waveformRef.current?.play();
        }

    };

    return (
        <Flex flexDirection="column" w="100%">
            <div id="waveform"/>
            <Flex flexDirection="row" justifyContent="center">
                <Button m="4" onClick={playAudio}>
                    Play / Pause
                </Button>
            </Flex>
        </Flex>
    );
};