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
      {/* <VStack py={6}> */}
      <Wrap spacingX={35}>
        {itws.map((itw: InterviewData) => (
          <WrapItem key={itw.id}>
            <InterviewShortCard params={{ interview: itw }} ></InterviewShortCard>
          </WrapItem>

        ))}
      </Wrap>
      {/* </VStack  > */}
    </>

  )
};