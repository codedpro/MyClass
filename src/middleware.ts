import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';


interface TokenCacheEntry {
    timestamp: number;
    isValid: boolean;
}

const tokenCache: { [key: string]: TokenCacheEntry } = {};

const CACHE_DURATION = 60 * 1000;

export async function middleware(request: NextRequest) {
    const publicPaths = ['/api/login', '/api/register', '/login', '/register'];
    const { pathname } = request.nextUrl;

    if (publicPaths.includes(pathname)) {
        return NextResponse.next();
    }

    const tokenCookie = request.cookies.get('token');
    const token = tokenCookie?.value;

    if (!token) {
        console.log('No token found, redirecting to login');
        return NextResponse.redirect(new URL('/login', request.url));
    }

    const currentTime = Date.now();
    const cachedToken = tokenCache[token];

    if (cachedToken && (currentTime - cachedToken.timestamp < CACHE_DURATION)) {
        if (cachedToken.isValid) {
            return NextResponse.next();
        } else {
            return NextResponse.redirect(new URL('/login', request.url));
        }
    }

    try {
        const response = await fetch(new URL('/api/verify-token', request.url).href, {
            headers: { Cookie: `token=${token}` },
        });

        if (response.status !== 200) {
            tokenCache[token] = { timestamp: currentTime, isValid: false };
            return NextResponse.redirect(new URL('/login', request.url));
        }

        tokenCache[token] = { timestamp: currentTime, isValid: true };

        return NextResponse.next();
    } catch (error) {
        if (error instanceof Error) {
            console.log(`Error verifying token: ${error.message}`);
        } else {
            console.log('Unknown error occurred during token verification');
        }
        return NextResponse.redirect(new URL('/login', request.url));
    }
}

export const config = {
    matcher: ['/((?!_next/static|favicon.ico|public).*)'],
};
