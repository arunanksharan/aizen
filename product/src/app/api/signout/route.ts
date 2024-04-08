import { createClient } from '@/app/lib/utils/supabase/serverClient';
import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log('user:', user);

  if (!user) {
    return new Response(JSON.stringify({ error: 'NOT_ALLOWED' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  try {
    const { error } = await supabase.auth.signOut();
  } catch (error) {
    console.log('Error during signout:', error);
  }

  console.log('Signout successful');
  console.log('Redirecting to ', new URL('/', request.url).toString());

  return NextResponse.redirect(new URL('/', request.url), { status: 302 });
}

export async function POST(request: Request) {
  return new Response(JSON.stringify({ error: 'METHOD_NOT_ALLOWED' }), {
    status: 400,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
