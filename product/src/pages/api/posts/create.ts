import { supabaseClient } from '@/utils/supabaseClient';
import { get } from 'http';
import type { NextApiRequest, NextApiResponse } from 'next';
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: process.env['NEXT_PUBLIC_OPENAI_API_KEY'],
  // dangerouslyAllowBrowser: true,
});

type ResponseData = {
  message: string;
  url: string | undefined;
  data: any;
};

function generateRandomInteger(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomUserName(): string {
  // Usernames
  const usernames: string[] = [
    'Misato',
    'Sora',
    'Aoi',
    'Akira',
    'Ami',
    'Asami',
    'Ichigo',
    'Naruto',
    'Sasuke',
    'Luffy',
    'po',
    'medalien',
    'diana',
    'jojomerijaan',
    'tai lung',
  ];
  return usernames[generateRandomInteger(0, usernames.length - 1)];
}

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
  res: NextApiResponse<ResponseData>
) {
  const { method } = req;
  const { prompt } = req.body;

  const openaiRes = await openai.images.generate({
    model: 'dall-e-3',
    prompt: prompt,
    n: 1,
    size: '1024x1024',
  });
  console.log(openaiRes);
  if (openaiRes.data[0].url) {
    // Save the generated image URL to the database

    const payload: PostsPayload = {
      prompt: prompt,
      url: openaiRes.data[0].url,
      likes: generateRandomInteger(1, 10000),
      username: getRandomUserName(),
      status: 'draft',
      description: openaiRes.data[0].revised_prompt,
    };

    const { data, error } = await supabaseClient
      .from('posts')
      .insert(payload)
      .select();

    return res.status(200).json({
      data: data![0],
      message: 'Image successfully generated and saved to the database',
      url: openaiRes.data[0].url,
    });
  } else {
    // Handle the case where the URL is undefined
    // For example, set a default image URL or log an error
    console.error('No URL returned from the API');
    return res.status(200).json({
      message: 'No Image Generated',
      url: 'https://cdn.openart.ai/published/cgnD3UBwcfhulYKrdiqE/7NsAknm9__QWK_1024.webp',
      data: {},
    });
  }
}
