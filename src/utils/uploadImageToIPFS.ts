/**
 *
 * @param imageBlob Blob of Image
 * @returns CID of image
 */

import { IPFS_UPLOAD_API } from "@/constants";

const API_TOKEN = process.env.WEB3STORAGE_TOKEN;

const uploadImageToIPFS = async (
  imageBlob: Blob | undefined
): Promise<string> => {
  try {
    const headersList = {
      Authorization: `Bearer ${API_TOKEN}`,
    };
    const filehash = await fetch(IPFS_UPLOAD_API, {
      method: "POST",
      headers: headersList,
      body: imageBlob,
    });
    const data = await filehash.json();
    return data.cid;
  } catch (error) {
    if (error instanceof Error) {
    }
    throw new Error("Something went wrong");
  }
};
export default uploadImageToIPFS;