import React from 'react';
import Post from './Post';

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
];

const Feed = () => {
  return (
    <div className="mt-10 min-h-screen">
      <div className="PostContainer">
        {sampleImages.map(({ url, id, likes, username, description }) => (
          <Post
            url={url}
            id={id}
            likes={likes}
            username={username}
            description={description}
            key={id}
          />
        ))}
      </div>
    </div>
  );
};

export default Feed;
