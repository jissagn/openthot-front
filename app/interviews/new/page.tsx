import { getBackendData } from '@/app/back_api';
import getFormattedTime from '@/app/time-ago';
import InterviewCard from '@/components/InterviewCard';
import InterviewForm from '@/components/forms/InterviewForm';
// import { Inter } from 'next/font/google';
// import Image from 'next/image';



// const inter = Inter({ subsets: ['latin'] })

export default async function NewInterview() {
  return (
    <main>
      {/* <Flex> */}
        <InterviewForm params={null} />
      {/* </Flex> */}

    </main>
  )
}