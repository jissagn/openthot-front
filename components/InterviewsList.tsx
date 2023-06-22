"use client"

import getFormattedTime from "@/app/time-ago"
import { Box, Button, Card, CardBody, CardHeader, Center, Flex, Heading, Link, Text, VStack } from "@chakra-ui/react"
import { useRouter } from "next/navigation";
import AudioPlayer from "./AudioPlayer";
import { MouseEvent, useContext, useRef } from "react";
import InterviewCard from "./InterviewCard";
import InterviewShortCard from "./InterviewShortCard";




export default function InterviewsList({
  params,
}: {
  params: {
    interviews: [InterviewData]
  };
}) {
  const itws = params.interviews;

  return (
    <>
      <VStack py={6}>
        {itws.map((itw: InterviewData) => (
          <InterviewShortCard params={{ interview: itw }} key={itw.id}></InterviewShortCard>

        ))}
      </VStack  >
    </>

  )
};