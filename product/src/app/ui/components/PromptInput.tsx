'use client';
import { POSTS_CREATE, POSTS_POST } from '@/app/lib/server/backend/apiRoutes';
import { BASE_URL } from '@/app/lib/utils/loadEnv';
import { set } from '@project-serum/anchor/dist/cjs/utils/features';
import Image from 'next/image';
import React, { useState } from 'react';
import { CornerDownLeft } from 'react-feather';

type PromptInputProps = {
  closeModal: () => void;
};

const PromptInput: React.FC<PromptInputProps> = ({
  closeModal,
}: PromptInputProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [draftImageId, setDraftImageId] = useState<number | null>(null);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string>('');
  const maxChars = 3000;
  const onChangeHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(event.target.value);
    console.log(event.target.value);
  };

  const createDraftPostRequest = async ({ prompt }: { prompt: string }) => {
    try {
      console.log(' line 22 Prompt:', prompt);
      const response = await fetch(`${BASE_URL}${POSTS_CREATE}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ prompt: prompt }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const createPostToFeed = async () => {
    try {
      console.log(' line 22 Post to feed:');
      const response = await fetch(`${BASE_URL}${POSTS_POST}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: draftImageId }),
      });
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.log('Error:', error);
    }
  };

  const onPromptSubmitHandler = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();
    console.log(prompt);

    // Send the prompt to the backend
    const res = await createDraftPostRequest({ prompt: prompt });
    console.log(res);
    setGeneratedImageUrl(res.url); // ToDo: Need to modify this to supabase store url
    setDraftImageId(res.data.id);
    setPrompt('');
  };

  const postImageToFeedHandler = async () => {
    console.log('Posting Image');
    console.log(draftImageId);
    const res = await createPostToFeed();
    console.log(res);
    closeModal();
    // ToDo: Link this to the feed page - feed refreshed here
  };
  return (
    <div className=" flex flex-col items-center justify-end w-full h-full ">
      {generatedImageUrl && (
        <>
          <Image
            src={generatedImageUrl}
            alt="Generated Image"
            width={500}
            height={500}
            className="mb-5 rounded-lg"
          />
          <button
            className="p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600 "
            onClick={postImageToFeedHandler}
          >
            {' '}
            Post
          </button>
        </>
      )}
      <div className="w-full h-1/4 border rounded-lg mt-2">
        <form
          className="relative w-full h-full  flex flex-row items-center justify-between"
          method="post"
          onSubmit={onPromptSubmitHandler}
        >
          <div className="absolute top-2 right-4 text-xs text-gray-500">
            {`${prompt.length}/${maxChars}`}
          </div>
          <textarea
            className="w-full h-full pl-2 rounded-lg resize-none min-h-[50px] max-h-[300px] overflow-auto"
            id="texttoimage"
            name="prompt"
            value={prompt}
            placeholder="Enter prompt here..."
            onChange={onChangeHandler}
            maxLength={maxChars}
          />
          <button
            type="submit"
            className="absolute bottom-4 right-4 p-2 rounded-lg bg-gray-700 text-white hover:bg-gray-600"
          >
            <CornerDownLeft className="" size={36} />
          </button>
        </form>
      </div>
      <div className="buttons">
        <p>{prompt}</p>
      </div>
    </div>
  );
};

export default PromptInput;

// h-full bg-slate-200 hover:cursor-pointer
