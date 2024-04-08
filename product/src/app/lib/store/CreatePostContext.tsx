'use client';
import { createContext, useContext, useState } from 'react';

type CreatePostContextType = {
  creationStarted: boolean;
  setCreationStarted: React.Dispatch<React.SetStateAction<boolean>>;
};
const createPostContextDefaultValues: CreatePostContextType = {
  creationStarted: false,
  setCreationStarted: () => {},
};

export const CreatePostContext = createContext<CreatePostContextType>(
  createPostContextDefaultValues
);

// Type for the children prop
type CreatePostContextProviderProps = {
  children: React.ReactNode;
};

export function useCreatePostContext() {
  return useContext(CreatePostContext);
}

export const CreatePostContextProvider: React.FC<
  CreatePostContextProviderProps
> = ({ children }) => {
  const [creationStarted, setCreationStarted] = useState<boolean>(false);

  const value = {
    creationStarted,
    setCreationStarted,
  };
  return (
    <CreatePostContext.Provider value={value}>
      {children}
    </CreatePostContext.Provider>
  );
};
