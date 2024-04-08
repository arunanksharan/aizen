// import { PostType } from '@/app/lib/definitions/types/Post';
// import { uploadToPinata } from '@/app/lib/utils/pinata';
// import { supabaseClient } from '@/app/lib/utils/supabase/supabaseClient';
// import type { NextApiRequest, NextApiResponse } from 'next';

// type ListResponseData = {
//   message: string;
//   data: any;
// };

// interface PostsPayload {
//   prompt?: string;
//   url?: string;
//   likes?: number;
//   username?: string;
//   status?: string;
//   description?: string;
// }

// // ToDo - since the entry is already created in Database
// // ToDo - We need to pass in the psot id and update status to posted

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<ListResponseData>
// ) {
//   const { method } = req;
//   if (method !== 'POST') {
//     return res.status(405).json({ message: 'Method not allowed', data: {} });
//   }

//   const { id } = req.body;

//   // Fetch Post from Supabase
//   const { data: postData, error: postError } = await supabaseClient
//     .from('posts')
//     .select()
//     .eq('id', id);
//   console.log('line 40', postData);

//   if (postError) {
//     return res.status(500).json({
//       message: 'Error fetching post',
//       data: {},
//     });
//   }

//   // Fetch Image from Supabase store
//   const typedPostData = postData[0] as PostType;
//   if (typedPostData.url) {
//     const imageStorePath = typedPostData.url; // Now guaranteed to be a string
//     console.log('line 53', imageStorePath);

//     const { data: downloadData, error: downloadError } =
//       await supabaseClient.storage.from('posts').download(imageStorePath);
//     console.log('line 57', downloadData);

//     if (downloadError) {
//       return res.status(500).json({
//         message: 'Error fetching image',
//         data: {},
//       });
//     }

//     const SLASH_DELIMITER = '/';
//     const imageFileName = imageStorePath
//       .split(SLASH_DELIMITER)
//       .slice(1)
//       .join(SLASH_DELIMITER);
//     console.log('71 - imageFileName', imageFileName);

//     // Upload image to Pinata and get imageCID - DONE

//     // ToDo: Check for error and add try-catch
//     const uploadToPinataRes = await uploadToPinata({
//       dataAsBlob: downloadData,
//       filename: imageFileName,
//     });
//     console.log('line 81 uploadToPinataRes', uploadToPinataRes);

//     const { IpfsHash } = uploadToPinataRes;
//     console.log('82: IpfsHash', IpfsHash);

//     // Generate Metadata CID
//     const { username, created_at, description } = typedPostData;
//     const imageMetadata = {
//       username,
//       name: imageFileName,
//       created_at,
//       description,
//       image: `ipfs://${IpfsHash}`,
//     };
//     const imageMetadataText = JSON.stringify(imageMetadata);
//     const metadataBlob = new Blob([imageMetadataText], { type: 'text/plain' });

//     const metadataFilename = imageFileName.split('.').slice(0, -1).join('.');

//     const uploadMetadataRes = await uploadToPinata({
//       dataAsBlob: metadataBlob,
//       filename: `${metadataFilename}.json`,
//     });

//     const metadataIpfsHash = await uploadMetadataRes.IpfsHash;

//     // ToDo: Update Supabase DB with CID
//     const { data: updateDbData, error: updataDbError } = await supabaseClient
//       .from('posts')
//       .update({
//         status: 'posted',
//         pinata_ipfshash: IpfsHash,
//         pinata_meta_ipfshash: metadataIpfsHash,
//       })
//       .eq('id', id)
//       .select();
//     console.log('87: updateDbData', updateDbData);
//     if (updataDbError) {
//       return res.status(500).json({
//         message: 'Error updating post',
//         data: {},
//       });
//     }
//     return res.status(200).json({
//       data: updateDbData,
//       message: 'Post updated successfully',
//     });
//   }
// }
