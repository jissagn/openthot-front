"use client"

import { VStack, Wrap, WrapItem } from "@chakra-ui/react"
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
      <Wrap spacing={30} >
        {itws.map((itw: InterviewData) => (
          <WrapItem key={itw.id}>
            <InterviewShortCard params={{ interview: itw }} ></InterviewShortCard>
          </WrapItem>

        ))}
      </Wrap>
    </>

  )
};