import { supabaseClient } from '@/app/lib/utils/supabase/supabaseClient';

export async function GET(request: Request) {
  return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
export async function POST(request: Request) {
  const { email, password, username } = await request.json();
  console.log('email:', email);
  console.log('password', password);
  console.log('username:', username);

  // Call Supabase SignUp API
  const { data, error } = await supabaseClient.auth.signUp({
    email,
    password,
    options: {
      data: {
        display_name: username,
      },
    },
  });

  console.log('data:', data);
  if (error) {
    console.error('Error during signup:', error);
    return new Response(
      JSON.stringify({ success: false, data: {}, error: 'An error occurred' }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json' },
      }
    );
  }

  return new Response(
    JSON.stringify({ success: true, data: { email: email }, error: null }),
    {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    }
  );
}
