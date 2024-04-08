// 'use server';
// import { signIn } from '@/dis-auth';
// import { AuthError } from 'next-auth';
// import { supabaseClient } from '../utils/supabaseClient';
// import { z } from 'zod';
// import { Sign } from 'crypto';
// import { SignUpErrorEnum } from '../definitions/enums/enums';

// export async function authenticate(
//   prevState: string | undefined,
//   formData: FormData
// ) {
//   try {
//     await signIn('credentials', formData);
//   } catch (error) {
//     if (error instanceof AuthError) {
//       switch (error.type) {
//         case 'CredentialsSignin':
//           return 'Invalid credentials.';
//         default:
//           return 'An error occurred.';
//       }
//     }
//     throw error;
//   }
// }

// export async function registerUser(
//   prevState: string | undefined,
//   formData: FormData
// ) {
//   try {
//     const email = formData.get('email') as string | null;
//     const password = formData.get('password') as string | null;

//     if (!email || !password) {
//       console.log('Email or password is missing');
//       return SignUpErrorEnum.EmailOrPasswordIsMissing;
//     }

//     const credentials = { email, password };
//     const parsedCredentials = z
//       .object({ email: z.string().email(), password: z.string().min(6) })
//       .safeParse(credentials);
//     console.log('43: actions.ts:');
//     console.log('parsedCredentials');
//     console.log(parsedCredentials);

//     if (parsedCredentials.success) {
//       const { email, password } = parsedCredentials.data;
//       const { data: user, error } = await supabaseClient.auth.signUp({
//         email: email,
//         password: password,
//         options: {
//           data: {
//             display_name: 'Arunank',
//           },
//         },
//       });
//       if (error) {
//         console.error('Error signing up:', error.message);
//         return SignUpErrorEnum.ErrorSigningUp;
//       }
//       console.log('64 User signed up:', user);

//       if (!user) return SignUpErrorEnum.SignUpFailure;
//       return SignUpErrorEnum.SignUpSuccess;
//     } else {
//       console.log('Invalid credentials format');
//       return SignUpErrorEnum.InvalidCredentialsFormat;
//     }
//   } catch (error) {
//     console.error('Error during signup:', error);
//     return SignUpErrorEnum.ErrorSigningUp;
//   }
// }
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { createClient } from '@/app/lib/utils/supabase/serverClient';
import { supabaseClient } from '../utils/supabase/supabaseClient';

export async function login(formData: FormData) {
  const supabase = createClient();

  // type-casting here for convenience
  // in practice, you should validate your inputs
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  };
  console.log('server action login 93 - data:', data);

  const { data: sbData, error } = await supabase.auth.signInWithPassword(data);
  console.log('server action login 96 - sbData:', sbData);

  console.log(supabase);

  if (error) {
    redirect('/error');
  }

  revalidatePath('/', 'layout');
  redirect('/home');
}

/**
 * Sign Up is being performed through route handler and supabase client
 */
// export async function signup(formData: FormData) {
//   const supabase = createClient();

//   // type-casting here for convenience
//   // in practice, you should validate your inputs
//   const data = {
//     email: formData.get('email') as string,
//     password: formData.get('password') as string,
//   };

//   const { error } = await supabase.auth.signUp(data);

//   if (error) {
//     redirect('/error');
//   }

//   revalidatePath('/', 'layout');
//   redirect('/');
// }
