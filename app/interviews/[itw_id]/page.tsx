import { getBackendData } from '@/app/back_api';
import getFormattedTime from '@/app/time';
import InterviewCard from '@/components/InterviewCard';
// import { Inter } from 'next/font/google';
// import Image from 'next/image';



// const inter = Inter({ subsets: ['latin'] })

export default async function Interview({
  params,
}: {
  params: { itw_id: string };
}) {
  const itw: InterviewData = await getBackendData({ endpoint: `api/v1/interviews/${params.itw_id}`, redir: `interviews/${params.itw_id}` });
  return (
    <main>
      <InterviewCard params={{
        interview: itw,
        with_player: true
      }}></InterviewCard>

    </main>
  )
}
