// FROM https://tabsoverspaces.in/posts/create-a-audio-player-in-nextjs/
// AND  https://blog.logrocket.com/building-audio-player-react/

"use client"
import { Button, Flex, useColorModeValue } from "@chakra-ui/react";
import { Fixed } from "chakra-ui";
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
                waveColor: "#808080", //"#567FFF",
                barGap: 2,
                barWidth: 3,
                barRadius: 3,
                cursorWidth: 3,
                cursorColor: "#008080",//"#567FFF",
                progressColor: "#008080",
                height: 50,
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
        <Flex flexDirection="column" w="100%" 
        // bg={"blackAlpha.100"}
        paddingTop={1}
        paddingBottom={2}
        boxShadow={`0px 5px 5px ${useColorModeValue('white', '#1a202c')}`}
        // shadow={"base"}
        backgroundColor={useColorModeValue('white', '#1a202c')}
        >
            <div id="waveform" />
            <Flex flexDirection="row" justifyContent="center">
                <Button onClick={playAudio}>
                    Play / Pause
                </Button>
            </Flex>
        </Flex>
    );
};