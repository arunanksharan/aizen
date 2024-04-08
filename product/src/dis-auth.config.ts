// import type { NextAuthConfig } from 'next-auth';

// export const authConfig: NextAuthConfig = {
//   pages: {
//     signIn: '/',
//   },
//   providers: [
//     // added later in auth.ts since it requires bcrypt which is only compatible with Node.js
//     // while this file is also used in non-Node.js environments
//   ],
//   callbacks: {
//     authorized({ auth, request: { nextUrl } }) {
//       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
//       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
//       console.log('authorized callback - nextUrl');
//       console.log(nextUrl);
//       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
//       console.log('authorized callback - auth');
//       console.log(auth);
//       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
//       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');

//       const isLoggedIn = !!auth?.user;
//       console.log('authorized callback - isLoggedIn');
//       console.log(isLoggedIn);
//       console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
//       const isOnHome = nextUrl.pathname.startsWith('/home');
//       if (isOnHome) {
//         if (isLoggedIn) return true;
//         return false; // Redirect unauthenticated users to login page
//       } else if (isLoggedIn) {
//         return Response.redirect(new URL('/home', nextUrl));
//       }
//       return true;
//     },
//   },
// } satisfies NextAuthConfig;
