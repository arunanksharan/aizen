// import NextAuth from 'next-auth';
// import { authConfig } from './dis-auth.config';
// import Credentials from 'next-auth/providers/credentials';
// import { z } from 'zod';
// import bcrypt from 'bcrypt';
// import { AccountSignInType } from '@/app/lib/definitions/types/User';
// import {
//   supabaseClient,
//   supabaseJwtSecret,
//   supabaseNextAuthAdapter,
// } from './app/lib/utils/supabaseClient';

// import jwt from 'jsonwebtoken';

// export const { auth, signIn, signOut } = NextAuth({
//   ...authConfig,
//   providers: [
//     Credentials({
//       credentials: {
//         email: {
//           label: 'Email',
//           type: 'text',
//           placeholder: 'jsmith@example.com',
//         },
//         password: { label: 'Password', type: 'password' },
//       },
//       async authorize(credentials, req) {
//         console.log('28: auth.ts:');
//         console.log(req);
//         console.log(credentials);
//         if (!credentials) return null;
//         const parsedCredentials = z
//           .object({ email: z.string().email(), password: z.string().min(6) })
//           .safeParse(credentials);
//         console.log('30: auth.ts:');
//         console.log(parsedCredentials);

//         if (parsedCredentials.success) {
//           const { email, password } = parsedCredentials.data;
//           // const user = await getUser(email);
//           const { data, error } = await supabaseClient.auth.signInWithPassword({
//             email: email,
//             password: password,
//           });
//           const { user, session } = data;

//           console.log('----------------inside auth.ts 47---------------');
//           console.log(user);
//           console.log(error);
//           console.log('----------------inside auth.ts 50---------------');

//           if (!user) return null;
//           return user;
//         }
//         console.log('Invalid credentials');
//         return null;
//       },
//     }),
//   ],
//   adapter: supabaseNextAuthAdapter,
//   callbacks: {
//     async session({ session, user }) {
//       const signingSecret = supabaseJwtSecret;
//       if (signingSecret) {
//         const payload = {
//           aud: 'authenticated',
//           exp: Math.floor(new Date(session.expires).getTime() / 1000),
//           sub: user.id,
//           email: user.email,
//           role: 'authenticated',
//         };
//         session.supabaseAccessToken = jwt.sign(payload, signingSecret);
//         console.log('----------------inside auth.ts session 73---------------');
//         console.log(user);
//         console.log(session);
//         console.log('----------------inside auth.ts 76---------------');
//       }
//       return session;
//     },
//   },
// });
