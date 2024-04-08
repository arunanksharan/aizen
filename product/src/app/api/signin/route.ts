import { supabaseClient } from '@/app/lib/utils/supabase/supabaseClient';
import { createClient } from '@/app/lib/utils/supabase/serverClient';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
  // redirect('/loginsuccess');
}
export async function POST(request: Request) {
  const { email, password } = await request.json();
  console.log('email:', email);
  console.log('password', password);
  const supabase = createClient();

  //   Call Supabase SignIn API
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error('Error during signin:', error);
    return new Response(
      JSON.stringify({ success: false, data: {}, error: 'An error occurred' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  console.log('data:', data);

  // Set the cookie
  // Create HTTP Only Cookie with the Session Token
  // const headers = new Headers();
  // headers.set(
  //   'Set-Cookie',
  //   `sessionToken=${data.session.access_token}; Path=/; HttpOnly; Secure; SameSite=Lax`
  // );
  // headers.set('Location', new URL('/home', request.url).toString());

  // return Response(null, {
  //   status: 303,
  //   headers: headers,
  // });

  return new Response(
    JSON.stringify({ success: true, data: { email: email }, error: null }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
