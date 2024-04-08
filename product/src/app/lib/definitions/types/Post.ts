export type PostType = {
  id?: string;
  user_id?: string;
  created_at?: string;
  updated_at?: string;
  likes?: number;
  gpt_url?: string | undefined;
  gpt_prompt?: string | undefined;
  status?: string;
  prompt?: string;
  filebase_image_cid?: string;
  filebase_metadata_cid?: string;
  pinata_image_cid?: string;
  pinata_metadata_cid?: string;
  image_public_url?: string; // ToDo: to be removed once migration done
  sb_store_filename?: string;
  description?: string;
  username?: string;
};

type ListResponseData = {
  message: string;
  data: any;
};

interface PostsPayload {
  prompt?: string;
  url?: string;
  likes?: number;
  username?: string;
  status?: string;
  description?: string;
}
