'use client';
import Image from 'next/image';
import React from 'react';

interface PostProps {
  imgUrl?: string;
  id?: string;
  likes?: number;
  username?: string;
  description?: string;
}
const Post: React.FC<PostProps> = ({
  imgUrl,
  id,
  likes,
  username,
  description,
}: PostProps) => {
  return (
    <div className="Post text-black mt-10 ml-20 mr-20 border-b border-slate-300 ">
      <Image
        className="border border-slate-300 rounded-lg"
        src={imgUrl!}
        width={500}
        height={500}
        alt="image"
      />
      {/* <img
        src={imgUrl}
        alt="image"
        className="border border-slate-300 rounded-lg"
      /> */}
      <div className="mt-5 font-semibold">{likes} likes</div>
      <div className="mt-2 mb-7 flex flex-row items-center">
        <div className="mr-5 font-bold">{username}</div>
        <div className="">{description}</div>
      </div>
    </div>
  );
};

export default Post;
