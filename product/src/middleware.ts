import { type NextRequest } from 'next/server';
import { updateSession } from '@/app/lib/utils/supabase/middleware';

export async function middleware(request: NextRequest) {
  // console.log('middleware');
  // console.log('request-url', request.cookies);
  // const sessionToken = request.cookies.get('authjs.session-token')?.value;
  // console.log('sessionToken:', sessionToken);

  // const value = JSON.parse(request.cookies.get('value'));

  // const pathname = request.nextUrl.pathname;
  // if (sessionToken && pathname === '/') {
  //   // User is logged in but at login page, redirect them to /home
  //   return Response.redirect(new URL('/home', request.url));
  // }
  // if (!sessionToken && pathname === '/') {
  //   // User is logged in but at login page, redirect them to /home
  //   return await updateSession(request);
  // }

  // if (sessionToken && !pathname.startsWith('/home')) {
  //   await updateSession(request);
  //   return Response.redirect(new URL('/home', request.url));
  // }
  // if (!sessionToken) {
  //   console.log(
  //     'redirecting to / - no sessionToken:',
  //     request.nextUrl.pathname
  //   );
  //   return Response.redirect(new URL('/', request.url));
  // }

  return await updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
