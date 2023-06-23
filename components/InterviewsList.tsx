"use client"

import { VStack } from "@chakra-ui/react"
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