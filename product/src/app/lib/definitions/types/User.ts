// Types for Account and Profile
export type AccountSignUpType = {
  id?: string;
  name?: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  username?: string;
};

export type AccountSignInType = {
  id?: string;
  username: string; // can pass in Email or Username
  password: string;
};

export type ProfileType = {
  id?: string;
  name: string;
  email: string;
  username: string;
  displayName?: string;
  createdAt?: string;
  updatedAt?: string;
  image_url?: string;
};
