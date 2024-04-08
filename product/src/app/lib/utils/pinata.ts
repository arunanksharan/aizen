interface UploadToPinataInterface {
  dataAsBlob: Blob;
  filename: string;
}

import { PINATA_JWT } from './loadEnv';

// Pinata IPFS Gateway URL: https://sapphire-tricky-mule-87.mypinata.cloud
// Pinata API URL: https://api.pinata.cloud

export async function uploadToPinata({
  dataAsBlob,
  filename,
}: UploadToPinataInterface) {
  console.log('118 - blob inside Pinata', dataAsBlob);
  console.log('123- filename:', `${filename}`);

  // Load to Pinata
  const data = new FormData();
  console.log('115', dataAsBlob);
  data.append('file', dataAsBlob, filename);
  console.log('117', data);
  data.append('pinataMetadata', JSON.stringify({ name: `${filename}` }));

  const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${PINATA_JWT}`,
    },
    body: data,
  });
  const resData = await res.json();
  console.log(resData);
  return resData;
}
