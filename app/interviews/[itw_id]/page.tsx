import { getBackendData } from '@/app/back_api';
import getFormattedTime from '@/app/time-ago';
import Card from '@/components/card';
import CardBody from '@/components/card_body';
import CardHeader from '@/components/card_header';
import Heading from '@/components/heading';
import Text from '@/components/text';
// import { Inter } from 'next/font/google';
// import Image from 'next/image';



// const inter = Inter({ subsets: ['latin'] })

export default async function Interview({
  params,
}: {
  params: { itw_id: string };
}) {
  const interview: InterviewData = await getBackendData("get", `api/v1/interviews/${params.itw_id}`);
  return (
    <main>
      <Card>
        <CardHeader>
          <Heading>{interview.name} (#{interview.id})</Heading>
        </CardHeader>
        <CardBody>
          <Heading>Uploadé</Heading>
          <Text>{getFormattedTime(interview.upload_ts)}</Text>
          <Heading>Transcript</Heading>
          <Text>{interview.transcript_withtimecode}</Text>
          <Text>Transcrit en {interview.transcript_duration_s} secondes</Text>
        </CardBody>
      </Card>

    </main>
  )
}
