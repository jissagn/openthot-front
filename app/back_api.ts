import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const url = process.env.BACKEND_API; // "http://127.0.0.1:8000/";

export async function getBackendData({ endpoint, body = null, redir = null }: { endpoint: string, body?: any, redir?: string | null }): Promise<any> {

  const authToken = cookies().get('auth-token')?.value;
  const reqInit: RequestInit = {
    method: 'GET',
    headers: new Headers({
      'Authorization': `Bearer ${authToken}`
    }),
    body: body
  };
  const res = await fetch(url + endpoint, reqInit);

  // The return value is *not* serialized
  // You can return Date, Map, Set, etc.

  // Recommendation: handle errors
  if (!res.ok) {
    const json = await res.json()
    if (res.status == 401) {
      let url = "/login"
      if (redir) url += "?redirect=" + redir
      redirect(url)
    }
    console.error(res.status, json)
    // This will activate the closest `error.js` Error Boundary
    throw new Error(`Failed to fetch data from ${endpoint}: ${res.status} | ${JSON.stringify(json["detail"])}`);
  }

  return await res.json();
}


