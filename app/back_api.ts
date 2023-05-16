import { cookies } from "next/headers";

const url = "http://127.0.0.1:8000/";

export async function getBackendData(method: string, endpoint: string, body: any = null): Promise<any> {
    // const bearer_token = localStorage.getItem('bearer_token');
  
    const authToken = cookies().get('auth-token')?.value;
    const reqInit: RequestInit = {
      method: method,
      headers: new Headers({
        'Authorization': `Bearer ${authToken}`
      }),
      body: body
    };
    const res = await fetch(url+endpoint, reqInit);
  
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
  
    // Recommendation: handle errors
    if (!res.ok) {
      // This will activate the closest `error.js` Error Boundary
      console.log(res)
      console.log(res.status)
      console.log(res.statusText)
      throw new Error('Failed to fetch data');
    }
  
    return await res.json();
  }


