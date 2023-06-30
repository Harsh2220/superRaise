"use client";

import Card from "@/components/Card";
import MyStreams from "@/components/MyStreams";
import ProfileCard from "@/components/ProfileCard";
import {
  ExplorePublicationRequest,
  FeedEventItemType,
  PublicationMainFocus,
  PublicationSortCriteria,
  useExploreLazyQuery,
  useExploreQuery,
  useFeedQuery,
} from "@/lens";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import React, { useEffect } from "react";

export default function Feed() {
  const { accessToken } = useAuthStore();
  const { currentProfile } = useProfileStore();

  async function get() {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      const SDKInstance = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      });
      const allStream = await SDKInstance.query.listStreams({
        sender: currentProfile?.ownedBy,
      });
      console.log(allStream.items);
    } catch (error) {
      console.log(error);
    }
  }
  useEffect(() => {
    get();
  }, []);

  const { data, error, loading, refetch, fetchMore } = useExploreQuery({
    variables: {
      request: {
        sortCriteria: PublicationSortCriteria.Latest,
        sources: ["crowdtest"],
      },
    },
    fetchPolicy: "network-only",
    context: {
      headers: {
        "x-access-token": `Bearer ${accessToken}`,
      },
    },
    // skip: !currentProfile || !accessToken,
  });
  console.log(data?.explorePublications.items);

  return (
    <div className="flex justify-evenly">
      <div className="max-w-2xl">
        {data &&
          data?.explorePublications?.items.length > 0 &&
          data?.explorePublications?.items?.map((item) => (
            <Card key={item?.id} item={item} />
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
