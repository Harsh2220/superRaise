"use client";
import { APP_ID } from "@/constants";
import { PublicationMainFocus, PublicationMetadataV2Input } from "@/lens";
import React from "react";
import { v4 as uuid } from "uuid";
export default function Upload() {
  const metadata: PublicationMetadataV2Input = {
    attributes: [],
    locale: "en-US",
    mainContentFocus: PublicationMainFocus.TextOnly,
    metadata_id: uuid(),
    name: "POst btttttu",
    version: "",
    appId: APP_ID,
    content: "Test contentttt",
  };

  const createPost = async () => {
    try {
      let headersList = {
        Accept: "*/*",
        "User-Agent": "Thunder Client (https://www.thunderclient.com)",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjB4YTQyM0EwNUViODRFQUI2NUU5MTM3ZEVhYmZCRDEyN2RjMjUzQzA1MiIsInJvbGUiOiJub3JtYWwiLCJpYXQiOjE2NzE3Njg5MjAsImV4cCI6MTY3MTc3MDcyMH0.I9ApBf0dnZsMTcPicG-GTO4CFjMye1AUWlkO3g5rlKw",
        "Content-Type": "application/json",
      };

      let bodyContent = JSON.stringify(metadata);

      let response = await fetch("http://localhost:3000/api/uploadMetadata", {
        method: "POST",
        body: bodyContent,
        headers: headersList,
      });

      let data = await response.text();
      console.log(data);
    } catch (error) {}
  };

  return (
    <section className="max-w-xl p-6 mx-auto bg-white rounded-md shadow-md mt-20">
      <h1 className="text-xl font-bold text-black capitalize">Create Post</h1>
      <div className="grid grid-cols-1 gap-6 mt-4 sm:grid-cols-1">
        <div>
          <label className="text-black" htmlFor="username">
            Post
          </label>
          <textarea
            id="username"
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
                  <span className="">Upload a file</span>
                  <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
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
