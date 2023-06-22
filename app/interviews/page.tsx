import { getBackendData } from '../back_api';
import InterviewsList from '@/components/InterviewsList';


export default async function Interviews() {
  const itws: [InterviewData] = await getBackendData({ endpoint: "api/v1/interviews/", redir: "/interviews" });
  // const nb_interviews = itws.length
  return (

    <InterviewsList params={{ interviews: itws }}></InterviewsList>
  )
}
