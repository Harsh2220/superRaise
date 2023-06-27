"use client";
import { APP_ID } from "@/constants";
import {
  PublicationMainFocus,
  PublicationMetadataDisplayTypes,
  useCreateDataAvailabilityPostViaDispatcherMutation,
} from "@/lens";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import uploadImageToIPFS from "@/utils/uploadImageToIPFS";
import { useState } from "react";
import toast from "react-hot-toast";
import { v4 as uuid } from "uuid";
export default function Upload() {
  const [postContent, setPostContent] = useState<string>("");
  const [image, setImage] = useState<File | null>(null);

  const { currentProfile } = useProfileStore();
  const { accessToken } = useAuthStore();
  const [createMomokaPost] = useCreateDataAvailabilityPostViaDispatcherMutation(
    {
      onCompleted: () => {
        toast("Campaign created!");
      },
      onError: (err) => {
        console.log(err);
        toast("Something went wrong");
      },
    }
  );

  const createPost = async () => {
    if (postContent.trim().length === 0) {
      toast("Please add more details about your campaign");
      return;
    }
    let metadata;
    if (image) {
      const hash = await uploadImageToIPFS(image);
      if (hash) {
        metadata = {
          version: "2.0.0",
          metadata_id: uuid(),
          appId: APP_ID,
          name: postContent,
          description: postContent,
          content: postContent,
          mainContentFocus: PublicationMainFocus.Image,
          tags: [],
          attributes: [
            {
              displayType: PublicationMetadataDisplayTypes.String,
              traitType: "handle",
              value: `@${currentProfile?.handle}`,
            },
            {
              displayType: PublicationMetadataDisplayTypes.String,
              traitType: "app",
              value: APP_ID,
            },
          ],
          media: [
            {
              item: `ipfs://${hash}`,
              type: image.type,
              cover: null,
            },
          ],
          image: `ipfs://${hash}`,
          imageMimeType: image.type,
          animation_url: null,
          external_url: `https://testnet.lenster.xyz/${currentProfile?.handle}`,
          locale: "en-US",
        };
      } else {
        console.log("image me locha, me chala");
        return;
      }
    } else {
      metadata = {
        version: "2.0.0",
        metadata_id: uuid(),
        appId: APP_ID,
        name: postContent,
        description: postContent,
        content: postContent,
        mainContentFocus: PublicationMainFocus.TextOnly,
        tags: [],
        attributes: [
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: "handle",
            value: `@${currentProfile?.handle}`,
          },
          {
            displayType: PublicationMetadataDisplayTypes.String,
            traitType: "app",
            value: APP_ID,
          },
        ],
        media: [],
        image: null,
        imageMimeType: null,
        animation_url: null,
        external_url: `https://testnet.lenster.xyz/${currentProfile?.handle}`,
        locale: "en-GB",
      };
    }

    try {
      let headersList = {
        Accept: "*/*",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify(metadata);

      let response = await fetch("/api/upload", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });
      if (response.ok) {
        const hash = await response.json();
        console.log("content uri", hash.uri);
        console.log("at", accessToken);
        createMomokaPost({
          variables: {
            request: {
              contentURI: hash,
              from: currentProfile?.id,
            },
          },
          context: {
            headers: {
              "x-access-token": `Bearer ${accessToken}`,
            },
          },
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <section className="max-w-xl p-6 mx-auto bg-white rounded-md shadow-md mt-20">
      <h1 className="text-xl font-bold text-black capitalize">
        Create Your Campaign
      </h1>
      <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
        <div>
          <label className="text-black" htmlFor="username">
            What is your campaign about?
          </label>
          <textarea
            id="username"
            value={postContent}
            placeholder="Write about your campaingn and tell us what you do?"
            onChange={(e) => {
              e.preventDefault();
              setPostContent(e.target.value);
            }}
            className="block w-full px-4 py-2 mt-2 text-gray-700 bg-white border border-gray-300 rounded-md focus:border-blue-500 focus:outline-none focus:ring"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-black">Image</label>
          <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
            <div className="space-y-1 text-center">
              <svg
                className="mx-auto h-12 w-12 text-black"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
              <div className="flex text-sm text-gray-600">
                <label
                  htmlFor="file-upload"
                  className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                >
                  <span className="">Upload your Images</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    onChange={(e) => {
                      e.preventDefault();
                      if (e.target.files) {
                        setImage(e.target.files[0]);
                      }
                    }}
                    className="sr-only"
                  />
                </label>
                <p className="pl-1 text-black">or drag and drop</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end mt-6">
        <button
          onClick={createPost}
          className="inline-flex items-center justify-center px-6 py-2 text-base font-semibold transition-all duration-200 rounded-md bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600"
        >
          Save
        </button>
      </div>
    </section>
  );
}
