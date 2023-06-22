import { stat } from 'fs';
import { init } from 'next/dist/compiled/@vercel/og/satori';
import { NextRequest, NextResponse } from 'next/server';
import { exit } from 'process';
// import { isAuthenticated } from '@lib/auth';

// inspired by https://maxschmitt.me/posts/next-js-http-only-cookie-auth-tokens

// import httpProxy from "http-proxy";
// import Cookies from "cookies";
// import url from "url";
// import { IncomingMessage } from 'http';
// import axios from 'axios';



const API_BASE_URL = "http://127.0.0.1:8000/";
const API_URL = API_BASE_URL + "api/v1/"; // TODO:



export async function middleware(request: NextRequest) {

    const isLogin = request.nextUrl.pathname.endsWith('/login')
    if (request.nextUrl.pathname.startsWith('/api/')) {
        // API-related calls


        // 1. Prepare request to backend API
        let headers = new Headers()

        // first check that we are authenticated
        if (!isLogin) {
            const authToken = request.cookies.get("auth-token")?.value;
            if (!authToken) {
                return NextResponse.json({ "detail": "You are not logged in" }, { status: 401 });
            } else {
                headers.append('Authorization', `Bearer ${authToken}`);
            }
        }

        // set to appropriate target (here we just replace "tld.com/api" with API_URL)
        let target = API_URL + request.nextUrl.pathname.replace(/\/api\//, '');
        if (request.nextUrl.searchParams.toString()) {
            target += "/?" + request.nextUrl.searchParams
        }


        // there are distinct sources of body depending on content-type
        let body = null;
        const contentType = request.headers.get("content-type")
        if (contentType == "application/json") {
            body = JSON.stringify(await request.json());
            headers.append('content-type', contentType);
        } else if (contentType?.startsWith("multipart/form-data")) {
            body = await request.formData();
            // do not add content-type to `headers` when multipart,
            // as it causes "bug" on backend and returns 4XX
        }

        // 2. Make the call to backend
        const backReq = await fetch(target,
            {
                headers: headers,
                method: request.method,
                body: body
            });

        // 3. Forward the call response
        if (target.endsWith("/audio")) {
            // the only endpoint that returns a binary instead of a JSON
            const data = await backReq.blob();
            const response = new NextResponse(data, { status: backReq.status });
            const cacheControlValue = backReq.headers.get("Cache-Control");
            if (cacheControlValue) { response.headers.set("Cache-Control", cacheControlValue); }
            return response;
        } else {
            // "regular" json endpoints
            let data;
            try {
                data = await backReq.json();
            } catch (error) {
                data = null; // { "": await backReq.text() };
            }
            
            const response = NextResponse.json({ data }, { status: backReq.status == 204 ? 200 : backReq.status })
            if (200 <= backReq.status && backReq.status < 300) {
                // special actions wrapping the login/logout token management
                // in order to deal with HTTP-only cookies
                if (target.endsWith('/logout')) {
                    response.cookies.delete("auth-token");
                } else if (target.endsWith("/login")) {
                    const access_token = data.access_token
                    // let response = NextResponse.json({ "details": "logged in" }, { status: backReq.status });
                    response.cookies.set('auth-token', access_token, {
                        httpOnly: true,
                        sameSite: 'strict',
                        maxAge: 3500,  // let it expire a bit before true expire
                    });
                }
            }
            return response

        }

    }
    else {
        // Pages-related
        const authToken = request.cookies.get("auth-token")?.value;
        // if (!authToken) {
        //     if (request.nextUrl.pathname == '/login') {
        //         return NextResponse.next();
        //     }
        //     return NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, 'http://127.0.0.1:3000')); // TODO: redirect
        // } else {
        //     if (request.nextUrl.pathname == '/login') {
        //         const redir = request.nextUrl.searchParams.get("redirect");
        //         if (redir) {
        //             return NextResponse.redirect(new URL(redir, request.url));
        //         }

        //     }
        //     return NextResponse.next();
        // }

        if (request.nextUrl.pathname == '/login') {
            const redir = request.nextUrl.searchParams.get("redirect");
            if (authToken && redir) return NextResponse.redirect(new URL(redir, request.url));
        } else {
            if (!authToken) NextResponse.redirect(new URL(`/login?redirect=${request.nextUrl.pathname}`, 'http://127.0.0.1:3000'));
        }

        return NextResponse.next();
    }

}


// Limit the middleware to paths
export const config = {
    matcher: ['/api/:path*', '/login', '/login/:path*', '/me', '/interviews', '/interviews/:path*'],
    // api: {
    //     bodyParser: false,
    // },
};
