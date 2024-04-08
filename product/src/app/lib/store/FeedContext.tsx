'use client';
import { PostType } from '@/app/lib/definitions/types/Post';
import { createContext, useContext, useState } from 'react';

type FeedContextType = {
  allPosts: PostType[] | [];
  setAllPosts: React.Dispatch<React.SetStateAction<Array<PostType>>>;
};
const feedContextDefaultValues: FeedContextType = {
  allPosts: [],
  setAllPosts: () => {},
};

export const FeedContext = createContext<FeedContextType>(
  feedContextDefaultValues
);

// Type for the children prop
type FeedContextProviderProps = {
  children: React.ReactNode;
};

export function useFeedContext() {
  return useContext(FeedContext);
}

export const FeedContextProvider: React.FC<FeedContextProviderProps> = ({
  children,
}) => {
  const [allPosts, setAllPosts] = useState<Array<PostType>>([]);

  const value = {
    allPosts,
    setAllPosts,
  };
  return <FeedContext.Provider value={value}>{children}</FeedContext.Provider>;
};
