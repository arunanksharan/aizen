import React from 'react';
import { CreatePostContextProvider } from '@/store/CreatePostContext';

export function Providers({ children }: { children: React.ReactNode }) {
  return <CreatePostContextProvider>{children}</CreatePostContextProvider>;
}
