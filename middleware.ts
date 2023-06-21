import { stat } from 'fs';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import { NextRequest, NextResponse } from 'next/server';
// import { isAuthenticated } from '@lib/auth';

// inspired by https://maxschmitt.me/posts/next-js-http-only-cookie-auth-tokens

// import httpProxy from "http-proxy";
// import Cookies from "cookies";
// import url from "url";
// import { IncomingMessage } from 'http';
// import axios from 'axios';



const API_BASE_URL = "http://127.0.0.1:8000/";
const API_URL = API_BASE_URL + "api/v1/"; // TODO:


// async function regentoken(token: string) {
//     const reqInit: RequestInit = {
//         method: "GET",
//         body: JSON.stringify({token: token})
//       };
//       const res = await fetch(API_BASE_URL, reqInit);
//       if(res.ok) {

//       }
// }

export async function middleware(request: NextRequest) {

    // console.log("yo");
    // const nr =  NextResponse.redirect(new URL('/home', request.url));
    // nr.headers.set('x-hello-from-middleware2', 'hello');
    // if(response.headers){
    // response.headers.set('x-hello-from-middleware2', 'hello');}

    // return response;
    // return NextResponse.rewrite(new URL('/about-2', request.url));
    // // Call our authentication function to check the request
    // if (request.nextUrl.pathname.startsWith('/api/login')) {
    //     return NextResponse.rewrite(new URL('/about-2', request.url));
    // }
    // if (!isAuthenticated(request)) {
    //     // Respond with JSON indicating an error message
    //     return new NextResponse(
    //         JSON.stringify({ success: false, message: 'authentication failed' }),
    //         { status: 401, headers: { 'content-type': 'application/json' } },
    //     );
    // }


    // return NextResponse.rewrite(new URL('/status', 'http://127.0.0.1:8000'));

    // return new Promise<void>((resolve, reject) => {
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // API-related
        if (request.nextUrl.pathname.startsWith('/api/login')) {
            const backend_url = `http://127.0.0.1:8000/api/v1/auth/jwt/login`
            const origFormData = await request.formData();
            const backReq = await fetch(backend_url,
                {
                    method: 'POST',
                    body: origFormData
                });
            const data = await backReq.json()
            console.log(data); // TODO: check that login failed or not
            if (backReq.status == 200) {
                const access_token = data.access_token
                let response = NextResponse.json({ "details": "logged in" }, { status: backReq.status });
                response.cookies.set('auth-token', access_token, {
                    httpOnly: true,
                    sameSite: 'strict',
                    maxAge: 3500,  // let it expire a bit before true expire
                });
                return response;
            } else {
                return NextResponse.json({ "details": "failed to log in" }, { status: backReq.status });
            }
        }
        else if (request.nextUrl.pathname.startsWith('/api/logout')) {
            const backend_url = `http://127.0.0.1:8000/api/v1/auth/jwt/logout`
            const authToken = request.cookies.get("auth-token")?.value;
            if (!authToken) {
                return NextResponse.json({ "detail": "You are not logged in" }, { status: 401 });
            }
            const response = await fetch(backend_url,
                {
                    headers: new Headers({
                        'Authorization': `Bearer ${authToken}`
                    }),
                    method: 'POST',
                });
            if (response.status == 204) {
                let response = NextResponse.json({ "details": "logged out" });
                response.cookies.delete("auth-token");
                return response
            }
        }
        // else if (request.nextUrl.pathname.startsWith('/api/password_forgotten')) {
        //     const backend_url = `http://127.0.0.1:8000/api/v1/auth/forgot-password`
        //     const origFormData = await request.formData();
        //     const email = origFormData.get("email");
        //     const response = await fetch(backend_url,
        //         {
        //             method: 'POST',
        //             body: JSON.stringify({ "email": email })
        //         });
        //     if (response.status == 202) {
        //         return NextResponse.json({ "details": "success. You've been sent a temporary token." })
        //     }
        // }
        else {
            const authToken = request.cookies.get("auth-token")?.value;
            if (!authToken) {
                return NextResponse.json({ "detail": "You are not logged in" }, { status: 401 });
            }
            let headers = new Headers({
                'Authorization': `Bearer ${authToken}`
            })

            // TODO: expiratio

            let target = API_URL + request.nextUrl.pathname.replace(/\/api\//, '');
            if (request.nextUrl.searchParams.toString()) {
                target += "/?" + request.nextUrl.searchParams
            }


            // distinct sources of body depending on content-type
            let body = null;
            const contentType = request.headers.get("content-type")
            if (contentType == "application/json") {
                headers.append('content-type', contentType);
                body = JSON.stringify(await request.json());
                
            } else if (contentType?.startsWith("multipart/form-data")) {
                headers.append('content-type', "multipart/form-data");
                body = await request.formData();
            }

            const backReq = await fetch(target,
                {
                    headers: headers,
                    method: request.method,
                    body: body
                });
            // TODO: check return code and act accordingly
            if (target.endsWith("/audio")) {
                const data = await backReq.blob();
                const response = new NextResponse(data, { status: backReq.status });
                const cacheControlValue = backReq.headers.get("Cache-Control");
                if (cacheControlValue) { response.headers.set("Cache-Control", cacheControlValue); }
                return response;
            } else {
                const data = await backReq.json();
                return NextResponse.json({ data }, { status: backReq.status });

            }
        }
    }
    else {
        // Pages-related
        const authToken = request.cookies.get("auth-token")?.value;
        if (!authToken) {
            if (request.nextUrl.pathname == '/login') {
                return NextResponse.next();
            }
            return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, 'http://127.0.0.1:3000')); // TODO: redirect
        } else {
            if (request.nextUrl.pathname.startsWith('/login')) {
                const redir = request.nextUrl.searchParams.get("redirect");
                if (redir) {
                    return NextResponse.redirect(new URL(redir, request.url));
                }

            }
        }


    }

    return NextResponse.next();
}


//     // Return a Promise to let Next.js know when we're done
//     // processing the request:
//     return new Promise<void>((resolve, reject) => {
//         // In case the current API request is for logging in,
//         // we'll need to intercept the API response.
//         // More on that in a bit.
//         // const pathname = url.parse(request.url).pathname;
//         const isLogin = request.nextUrl.pathname.startsWith('/api/login');

//         // Get the `auth-token` cookie:
//         //   const cookies = new Cookies(request, response);
//         const authToken = request.cookies.get("auth-token")?.value;


//         // Rewrite the URL: strip out the leading '/api'.
//         // For example, '/api/login' would become '/login'.
//         // ️You might want to adjust this depending
//         // on the base path of your API.

//         const fwdRequest = new NextRequest(request.url.replace(/^\/api/, API_BASE_URL), request);   



//         // Don't forward cookies to the API:
//         fwdRequest.cookies.clear();

//         // Set auth-token header from cookie:
//         if (authToken) {
//             fwdRequest.headers.set("auth-token", authToken);
//         }

//         // In case the request is for login, we need to
//         // intercept the API's response. It contains the
//         // auth token that we want to strip out and set
//         // as an HTTP-only cookie.
//         if (isLogin) {
//                 proxy.once("proxyRes", interceptLoginResponse);
//         } 


//         // Don't forget to handle errors:
//         proxy.once("error", reject);

//         // let prout = new IncomingMessage(request)

//         // Forward the request to the API
//         proxy.web(request, response, {
//             target: API_URL,

//             // Don't autoRewrite because we manually rewrite
//             // the URL in the route handler.
//             autoRewrite: false,

//             // In case we're dealing with a login request,
//             // we need to tell http-proxy that we'll handle
//             // the client-response ourselves (since we don't
//             // want to pass along the auth token).
//             selfHandleResponse: isLogin,
//         });

//         function interceptLoginResponse(proxyRes, request, response) {
//             // Read the API's response body from
//             // the stream:
//             let apiResponseBody = "";
//             proxyRes.on("data", (chunk: any) => {
//                 apiResponseBody += chunk;
//             });

//             // Once we've read the entire API
//             // response body, we're ready to
//             // handle it:
//             proxyRes.on("end", () => {
//                 try {
//                     // Extract the authToken from API's response:
//                     const { authToken } = JSON.parse(apiResponseBody).access_token;

//                     // Set the authToken as an HTTP-only cookie.
//                     // We'll also set the SameSite attribute to
//                     // 'lax' for some additional CSRF protection.
//                     const cookies = new Cookies(req, res);
//                     cookies.set("auth-token", authToken, {
//                         httpOnly: true,
//                         sameSite: "lax",
//                     });

//                     // Our response to the client won't contain
//                     // the actual authToken. This way the auth token
//                     // never gets exposed to the client.
//                     response.status(200).json({ loggedIn: true });
//                     resolve();
//                 } catch (err) {
//                     reject(err);
//                 }
//             });
//         }
//     });
// };

// // Limit the middleware to paths starting with `/api/`
export const config = {
    matcher: ['/api/:path*', '/login', '/login/:path*', '/me', '/interviews', '/interviews/:path*'],
    // api: {
    //     bodyParser: false,
    // },
};
