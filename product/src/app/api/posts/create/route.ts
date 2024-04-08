import { supabaseClient } from '@/app/lib/utils/supabase/supabaseClient';
import { createClient } from '@/app/lib/utils/supabase/serverClient';
import { redirect } from 'next/navigation';
import { cookies } from 'next/headers';
import OpenAI from 'openai';
import { PostType } from '@/app/lib/definitions/types/Post';
import {
  SUPABASE_BUCKET_NAME,
  SUPABASE_FOLDER_NAME,
} from '@/app/lib/utils/constants';

const openai = new OpenAI({
  apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
  // dangerouslyAllowBrowser: true,
});

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export async function GET(request: Request) {
  return new Response(
    JSON.stringify({ success: false, data: {}, message: 'Method not allowed' }),
    { status: 400, headers: { 'Content-Type': 'application/json' } }
  );
}

export async function POST(request: Request) {
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
  const { prompt } = await request.json();
  console.log('prompt:', prompt);

  const openaiRes = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
  });
  console.log(openaiRes);
  if (openaiRes.data[0].url) {
    // Save the generated image URL to the database

    // Fetch image data uisng the url
    const imageRes = await fetch(openaiRes.data[0].url, { method: 'GET' });
    const imageBlob = await imageRes.blob();
    const arrayBuffer = await imageBlob.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    console.log(buffer);

    // Upload the image to the supabase object store
    // need username for filename
    const username = user.user_metadata.display_name;
    const user_id = user.id;
    const imageFilename = `${user_id}-${Date.now()}.png`;

    const imagePath = `${SUPABASE_FOLDER_NAME}/${imageFilename}`;

    // Upload the buffer directly to Supabase Storage without writing to disk
    // SUPABASE_BUCKET_NAME & SUPABASE_FOLDER_NAME defined in utils/constants.ts
    const { data: imageStoreData, error: imageStoreError } =
      await supabaseClient.storage
        .from(SUPABASE_BUCKET_NAME)
        .upload(imagePath, buffer, {
          contentType: 'image/png', // Ensure you set the correct content type for your image
          upsert: true, // Set to true to overwrite an existing file with the same path
        });

    // handle error
    if (imageStoreError) {
      return new Response(
        JSON.stringify({
          message: 'Error uploading image to supabase store',
          data: {},
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }
    console.log(imageStoreData);
    // Assert the type of imageStoreData to include the custom interface
    // const typedImageStoreData = imageStoreData as UploadResponse;
    // const imageStoreUrl = typedImageStoreData.Key;

    // Insert the post into the database - will act as metadata for the image
    const payload: PostType = {
      prompt: prompt,
      sb_store_filename: imageFilename,
      likes: generateRandomInteger(1, 10000),
      status: 'draft',
      gpt_prompt: openaiRes.data[0].revised_prompt,
      gpt_url: openaiRes.data[0].url,
      username: username,
      user_id: user_id,
    };

    // Logging Supabase DB entry
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxx DB PAYLOAD START xxxxxxxxxxxxxxxxxxx');
    console.log('payload:', payload);
    console.log('xxxxxxxxxxxxxxxxx DB PAYLOAD ENDxxxxxxxxxxxxxxxxxxxx');
    console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
    const { data, error } = await supabaseClient
      .from('posts')
      .insert(payload)
      .select();

    // Handle error
    if (error) {
      return new Response(
        JSON.stringify({
          message: 'Error inserting post into the database',
          data: {},
        }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({
        data: data![0],
        message: 'Image successfully generated and saved to the database',
        url: openaiRes.data[0].url, // Change this to supabase store filename
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  } else {
    // Handle the case where the URL is undefined
    // For example, set a default image URL or log an error
    console.error('No URL returned from the API');
    return new Response(
      JSON.stringify({ message: 'No Image Generated', url: '', data: {} }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
