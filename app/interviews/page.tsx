// import Image from 'next/image'
// import { Inter } from 'next/font/google'
// import styles from './page.module.css'
import Link from 'next/link';
import getFormattedTime from '../time-ago';

import UnorderedList from '@/components/unordered_list';
import ListItem from '@/components/list_item';
import { getBackendData } from '../back_api';


// import { useState } from 'react';
// import { useRouter } from 'next/navigation';
// import { useSearchParams } from 'next/navigation';





export default async function Interviews() {
  const interviews: [InterviewData] = await getBackendData("get", "api/v1/interviews/");
  const nb_interviews = interviews.length

  // const [username, setUsername] = useState('');
  // const [password, setPassword] = useState('');
  // const router = useRouter();
  // const redirect = useSearchParams().get('redirect');

  // function handleUsernameChange(e) {
  //   setUsername(e.target.value);
  // }

  // function handlePasswordChange(e) {
  //   setPassword(e.target.value);
  // }

  // async function handleSubmit(e) {
  //   e.preventDefault();
  //   const formData = new FormData();
  //   formData.append('username', username);
  //   formData.append('password', password);
  //   const res = await fetch(`./api/interviews`, {  //`http://127.0.0.1:3000/api/login`
  //     method: 'POST',
  //     body: formData
  //   });
  //   if (res.status == 200) {
  //     const json = await res.json();
  //     console.log("prout");
  //     console.log(json);
  //     // localStorage.setItem('bearer_token', json.access_token);
  //     // window.location.replace("http://stackoverflow.com");
  //     router.push(redirect);
      
  //   } else {
  //     console.log(res.status);
  //     console.log(res.json());
  //     console.error('Login failed.')

  //   }
  // }


  
  return (
    <>
      <div>
        <p>interviews page</p>
      </div>

      <UnorderedList>
        {interviews.map((interview: InterviewData) => (
          <ListItem key={interview.id}>

            <Link
              href={`interviews/${interview.id}`}
            >
              {/* <interviewsIcon /> */}
              <div> {interview.name} uploadé {getFormattedTime(interview.upload_ts)}.

                {interview.transcript_duration_s > 0 && (
                  <div>
                    (le transcript a pris {new Number(interview.transcript_duration_s).toLocaleString()}s)
                  </div>
                )}</div>
            </Link>
          </ListItem>

        ))}
      </UnorderedList>
    </>
  )
}
