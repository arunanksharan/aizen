import { supabaseClient } from '@/utils/supabaseClient';
import type { NextApiRequest, NextApiResponse } from 'next';

type ListResponseData = {
  message: string;
  data: any;
};

interface PostsPayload {
  prompt?: string;
  url?: string;
  likes?: number;
  username?: string;
  status?: string;
  description?: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ListResponseData>
) {
  const { method } = req;
  if (method == 'POST') {
    return res.status(405).json({ message: 'Method not allowed', data: {} });
  }

  const { data, error } = await supabaseClient.from('posts').select();
  //   console.log(data);

  if (data) {
    // Save the generated image URL to the database

    return res.status(200).json({
      data: data,
      message: 'Posts successfully retrieved',
    });
  } else {
    // Handle the case where the URL is undefined
    // For example, set a default image URL or log an error
    console.error('No Posts returned from the API');
    return res.status(200).json({
      message: 'No Posts Avaliable',
      data: {},
    });
  }
}
