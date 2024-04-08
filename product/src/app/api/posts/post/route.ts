import { PostType } from '@/app/lib/definitions/types/Post';
import { uploadToPinata } from '@/app/lib/utils/pinata';
import type { NextApiRequest, NextApiResponse } from 'next';
import { createClient } from '@/app/lib/utils/supabase/serverClient';
import {
  SUPABASE_BUCKET_NAME,
  SUPABASE_FOLDER_NAME,
  SUPABASE_STORE_BASE_URL,
} from '@/app/lib/utils/constants';

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

  const { id } = await request.json();
  console.log('Post Id:', id);

  // Fetch Post from Supabase
  const { data: postData, error: postError } = await supabase
    .from('posts')
    .select()
    .eq('id', id);
  console.log('line 40', postData);

  if (postError) {
    return new Response(
      JSON.stringify({ message: 'Error fetching post', data: {} }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Fetch Image from Supabase store
  const typedPostData = postData[0] as PostType;

  // ToDo: change url to sb_store_filename and convert to public url for supabase
  //   if (typedPostData.url) {
  if (typedPostData.sb_store_filename) {
    const imagePublicUrl = `${SUPABASE_STORE_BASE_URL}/${SUPABASE_BUCKET_NAME}/${SUPABASE_FOLDER_NAME}/${typedPostData.sb_store_filename}`; //typedPostData.url;

    const imageStorePath = typedPostData.sb_store_filename; //typedPostData.url;
    console.log('line 53', imageStorePath);

    const imageStoreFilename = typedPostData.sb_store_filename;
    const imageStoreFilenameWithFolder = `${SUPABASE_FOLDER_NAME}/${imageStoreFilename}`;

    const { data: downloadData, error: downloadError } = await supabase.storage
      .from('posts')
      .download(imageStoreFilenameWithFolder);
    console.log('line 57', downloadData);

    if (downloadError) {
      return new Response(
        JSON.stringify({ message: 'Error fetching image', data: {} }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }

    // ToDo: Remove this entirely since working directly with image filename
    // const SLASH_DELIMITER = '/';
    // const imageFileName = imageStorePath
    //   .split(SLASH_DELIMITER)
    //   .slice(1)
    //   .join(SLASH_DELIMITER);
    // console.log('71 - imageFileName', imageFileName);

    // Upload image to Pinata and get imageCID - DONE

    // ToDo: Check for error and add try-catch
    const uploadToPinataRes = await uploadToPinata({
      dataAsBlob: downloadData,
      filename: imageStoreFilename,
    });
    console.log('line 81 uploadToPinataRes', uploadToPinataRes);

    const { IpfsHash } = uploadToPinataRes;
    console.log('82: IpfsHash', IpfsHash);

    // Generate Metadata CID
    // Todo: Add Aizen id here
    const { user_id, created_at, gpt_prompt } = typedPostData;
    const imageMetadata = {
      user_id,
      name: imageStoreFilename,
      created_at,
      gpt_prompt,
      image: `ipfs://${IpfsHash}`,
    };
    const imageMetadataText = JSON.stringify(imageMetadata);
    const metadataBlob = new Blob([imageMetadataText], { type: 'text/plain' });

    // ToDo: Remove this entirely since working directly with image filename - maybe add txt file
    const metadataFilename = `${imageStoreFilename
      .split('.')
      .slice(0, -1)
      .join('.')}`;
    console.log('metadataFilename:', metadataFilename);

    const uploadMetadataRes = await uploadToPinata({
      dataAsBlob: metadataBlob,
      filename: `${metadataFilename}.json`,
    });

    const metadataIpfsHash = await uploadMetadataRes.IpfsHash;

    // ToDo: Receive description from user and add to DB
    const { data: updateDbData, error: updataDbError } = await supabase
      .from('posts')
      .update({
        status: 'posted',
        pinata_image_cid: IpfsHash,
        pinata_metadata_cid: metadataIpfsHash,
      })
      .eq('id', id)
      .select();
    console.log('87: updateDbData', updateDbData);
    if (updataDbError) {
      return new Response(
        JSON.stringify({ message: 'Error updating post', data: {} }),
        { status: 200, headers: { 'Content-Type': 'application/json' } }
      );
    }
    return new Response(
      JSON.stringify({
        data: updateDbData,
        message: 'Post updated successfully',
      }),
      { status: 200, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

// xxxxxxxxxxxxxxx

// ToDo - since the entry is already created in Database
// ToDo - We need to pass in the post id and update status to posted
