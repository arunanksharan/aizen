'use client';
import React, { useEffect, useState } from 'react';
import Post from './Post';
import { POSTS_LIST } from '@/app/lib/server/backend/apiRoutes';
import { BASE_URL } from '@/app/lib/utils/loadEnv';
import { PostType } from '@/app/lib/definitions/types/Post';

const sampleImages = [
  {
    url: 'https://cdn.openart.ai/published/KuNdla1OswlPZGzCtehL/1MMIr_dX_Il4k_1024.webp',
    id: 1,
    likes: 10,
    username: 'jojomerijaan',
    description: 'A beautiful sunset in with Jojo',
  },
  {
    url: 'https://cdn.openart.ai/published/cgnD3UBwcfhulYKrdiqE/7NsAknm9__QWK_1024.webp',
    id: 2,
    likes: 20,
    username: 'diana',
    description: 'Tell me again? Do you fear me?',
  },
  {
    url: 'https://cdn.openart.ai/published/7hFxMzyXexqo4wpJJQQz/2jqqN3tc_jwC8_1024.webp',
    id: 3,
    likes: 23,
    username: 'medalien',
    description: 'Meditative calm for the interplanetary soul',
  },
  {
    description: 'Kung Fu Panda kicking dumplings',
    url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-bJfte44Pu2QRc8QZ8ktdPFCn/user-s5dn2Mc9407foVdNAD4Au4Ta/img-kijWUsrXU80JU6X8PgCEAPDj.png?st=2024-03-22T11%3A02%3A35Z&se=2024-03-22T13%3A02%3A35Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-21T21%3A00%3A30Z&ske=2024-03-22T21%3A00%3A30Z&sks=b&skv=2021-08-06&sig=An01hiS5gFUj8N37VfRO2RCdSd2IQShZWXC7eGbBG1U%3D',
    id: 4,
    likes: 104,
    username: 'po',
  },
  {
    description: 'Dragon warrior practicing kung fu',
    url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-bJfte44Pu2QRc8QZ8ktdPFCn/user-s5dn2Mc9407foVdNAD4Au4Ta/img-UtIHdR0Sz0WjIe1brsXpD2kt.png?st=2024-03-22T11%3A18%3A38Z&se=2024-03-22T13%3A18%3A38Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-03-21T21%3A00%3A06Z&ske=2024-03-22T21%3A00%3A06Z&sks=b&skv=2021-08-06&sig=pPOk1kKsy3b1DKRiZXeiViRS0FiS7bochmczJ8rONK0%3D',
    id: 5,
    likes: 104,
    username: 'tai lung',
  },
  {
    id: 6,
    url: 'https://oaidalleapiprodscus.blob.core.windows.net/private/org-bJfte44Pu2QRc8QZ8ktdPFCn/user-s5dn2Mc9407foVdNAD4Au4Ta/img-9V7kfSWIEzO16IxcbyedxL2t.png?st=2024-04-07T15%3A46%3A46Z&se=2024-04-07T17%3A46%3A46Z&sp=r&sv=2021-08-06&sr=b&rscd=inline&rsct=image/png&skoid=6aaadede-4fb3-4698-a8f6-684d7786b067&sktid=a48cca56-e6da-484e-a814-9c849652bcb3&skt=2024-04-06T23%3A45%3A20Z&ske=2024-04-07T23%3A45%3A20Z&sks=b&skv=2021-08-06&sig=FevX/qkdcF3LBouU3v4iZUepGy%2BAqODXCW3uWZVDhvE%3D',
    description:
      'A beautiful woman of East Asian descent, wearing a traditional kimono, is seated at a low traditional Japanese table. She is delicately holding a pair of chopsticks as she prepares to enjoy a platter of sushi resting on the table before her. A light paper lantern provides a warm, soft glow to the scene, accentuating the intricate floral patterns on her kimono. She has a look of contentment and anticipation on her face as she smiles at the delicious array of sushi, savouring the delightful culinary experience that is about to unfold.',
    likes: 104,
    username: 'sushi',
  },
];

const Feed = () => {
  const [posts, setPosts] = useState<PostType[]>([]);

  useEffect(() => {
    const updatePosts = async () => {
      const newPostsRes = await fetch(`${BASE_URL}${POSTS_LIST}`);
      const newPosts = await newPostsRes.json();
      console.log('line 74', newPosts);
      setPosts(newPosts.data);
    };

    updatePosts();
    console.log('line 75 - logging posts', posts);
    // const intervalId = setInterval(updatePosts, 30000);

    // return () => clearInterval(intervalId); // Cleanup on component unmount
  }, []);

  // useEffect(() => {
  // console.log('inside useEffect line 78', posts);
  // }, [posts]);

  // console.log('line 78', posts);
  // console.log('line 80 posts length', posts.length);
  // console.log('line 80', posts[0][username]);

  console;
  return (
    <div className="mt-10 min-h-screen">
      <div className="PostContainer">
        {posts &&
          posts.map(
            ({ image_public_url, id, likes, description, username }) => (
              <Post
                imgUrl={image_public_url}
                id={id}
                likes={likes}
                username={username}
                description={description}
                key={id}
              />
            )
          )}
        {/* {sampleImages &&
          sampleImages.map(({ url, id, likes, username, description }) => (
            <Post
              url={url}
              id={id}
              likes={likes}
              username={username}
              description={description}
              key={id}
            />
          ))} */}
      </div>
    </div>
  );
};

export default Feed;
