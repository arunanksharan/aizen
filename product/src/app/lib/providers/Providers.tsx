import React from 'react';
import { CreatePostContextProvider } from '@/app/lib/store/CreatePostContext';
import { FeedContextProvider } from '@/app/lib/store/FeedContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CreatePostContextProvider>{children}</CreatePostContextProvider>
      <FeedContextProvider>{children}</FeedContextProvider>
    </>
  );
}
