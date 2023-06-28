"use client";

import Card from "@/components/Card";
import ProfileCard from "@/components/ProfileCard";
import { FeedEventItemType, PublicationMainFocus, useFeedQuery } from "@/lens";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import React from "react";

export default function Feed() {
  const { accessToken } = useAuthStore();
  const { currentProfile } = useProfileStore();

  const QueryRequest = {
    profileId: currentProfile?.id,
    limit: 10,
    metadata: {
      mainContentFocus: [PublicationMainFocus.Video],
    },
    feedEventItemTypes: [FeedEventItemType.Post],
    sources: ["crowdtest"],
  };

  const { data, error, loading, refetch, fetchMore } = useFeedQuery({
    variables: {
      request: QueryRequest,
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "x-access-token": `Bearer ${accessToken}`,
      },
    },
    skip: !currentProfile || !accessToken,
  });

  return (
    <div className="flex justify-evenly">
      <div className="max-w-2xl">
        {data &&
          data?.feed.items.length > 0 &&
          data?.feed.items.map((item) => (
            <Card key={item?.root?.id} item={item} />
          ))}
      </div>
      <div className="w-80 bg-white p-8 max-h-80 m-8 rounded-lg shadow-lg sticky top-20">
        <h1 className="text-2xl font-semibold">Top investors</h1>
        <div className="mt-4">
          <ProfileCard address={""} />
        </div>
      </div>
    </div>
  );
}
