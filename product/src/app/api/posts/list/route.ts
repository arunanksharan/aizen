import { supabaseClient } from '@/app/lib/utils/supabase/supabaseClient';
import { createClient } from '@/app/lib/utils/supabase/serverClient';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import {
  SUPABASE_BUCKET_NAME,
  SUPABASE_FOLDER_NAME,
  SUPABASE_STORE_BASE_URL,
} from '@/app/lib/utils/constants';

export async function GET(request: Request) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new Response(JSON.stringify({ error: 'NOT_ALLOWED' }), {
      status: 400,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }

  console.log('user:', user);
  console.log('user_id', user.id);
  console.log('user_meta', user.user_metadata.display_name);

  const { data, error } = await supabaseClient.from('posts').select();
  //   console.log(data);

  if (data) {
    // convert the sb_store_filename to a public url
    data.forEach((post: any) => {
      if (post.sb_store_filename) {
        post.image_public_url = `${SUPABASE_STORE_BASE_URL}/${SUPABASE_BUCKET_NAME}/${SUPABASE_FOLDER_NAME}/${post.sb_store_filename}`;
      }
    });
    console.log(data);

    return new Response(
      JSON.stringify({ data: data, message: 'Posts successfully retrieved' }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } else {
    // Handle the case where the URL is undefined
    // For example, set a default image URL or log an error
    console.error('No Posts returned from the API');
    return new Response(
      JSON.stringify({ message: 'No Posts Avaliable', data: [] }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Ideally redirect to login page if unauthenticated: redirect('/');
}
export async function POST(request: Request) {
  return new Response(
    JSON.stringify({ success: false, data: {}, message: 'Method not allowed' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}
