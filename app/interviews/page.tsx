import Link from 'next/link';


import { getBackendData } from '../back_api';
import InterviewCard from '@/components/InterviewCard';
import Flex from '@/components/flex';
import InterviewForm from '@/components/InterviewForm';


export default async function Interviews() {
  const itws: [InterviewData] = await getBackendData("get", "api/v1/interviews/");
  // const nb_interviews = itws.length

  return (
    <>
      <div>
        <p>interviews page</p>
      </div>
      {/* <Heading fontSize={'base'} lineHeight={'normal'} letterSpacing={'normal'} wordBreak={'normal'} as={'symbol'}>
      interviews page
      </Heading> */}

      <Flex>
        <InterviewForm params={null} />
      </Flex>
      {/* <UnorderedList> */}
      {itws.map((itw: InterviewData) => (
        // <ListItem key={itw.id}>

        <Flex key={itw.id}>
          <Link
            href={`interviews/${itw.id}`}

          >
            <InterviewCard params={{
              interview: itw,
              with_player: false
            }}></InterviewCard>
          </Link>
        </Flex>
        // </ListItem>

      ))}
      {/* </UnorderedList> */}
    </>
  )
}
