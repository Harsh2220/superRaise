"use client";

/* eslint-disable @next/next/no-img-element */
import { FeedItem, Mirror, Post } from "@/lens";
import useProfileStore from "@/store/profileStore";
import createInvestStream from "@/utils/createFlow";
import getInvestedCampaigns from "@/utils/getInvestedCampaigns";
import React, { useState } from "react";
import toast from "react-hot-toast";
import Avatar from "./UI/Avatar";
import getIPFSLink from "@/utils/getIPFSLink";
import getRawurl from "@/utils/getRawURL";

export enum SuperTokens {
  TestMatic = "MATICx",
  TestDAI = "fDAIx",
}

type Publication = Post | Mirror;
const Card = ({ item }: { item: Publication }) => {
  const { currentProfile } = useProfileStore();
  const [isCreating, setIsCreating] = useState(false);
  React.useEffect(() => {
    getInvestedCampaigns({ sender: currentProfile?.ownedBy }).then((res) => {
      //Filter fhere by app_id
      console.log(res);
    });
    console.log(item?.profile?.ownedBy);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentProfile?.ownedBy]);

  return (
    <div className="max-w-2xl p-8 bg-white rounded-lg m-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar
            src={getIPFSLink(getRawurl(item?.profile?.picture))}
            height={40}
            width={40}
          />
          <div className="ml-2">
            <h1 className="text-md leading-3 font-medium">
              {item?.profile?.name}
            </h1>
            <p className="text-gray-500 text-sm">{item?.profile?.handle}</p>
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center px-6 py-2 text-base font-semibold transition-all duration-200 rounded-md bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600"
          onClick={(e) => {
            e.preventDefault();
            const promt = confirm(
              "You will be investing 0.000025 fDAIx/sec in this project"
            );
            if (!promt) return;
            setIsCreating(true);
            const streamConfig = {
              flowRate: "150",
              receiverAddress: item?.profile?.ownedBy,
              senderAddress: currentProfile?.ownedBy,
              streamToken: SuperTokens.TestDAI,
            };
            createInvestStream(streamConfig)
              .then((res) => {
                toast(res as string);
              })
              .catch((err) => {
                if (err instanceof Error) {
                  toast(err.message);
                }
              }).finally(() => {
                setIsCreating(false)
              });
          }}
        >
          {isCreating ? "Creating..." : "Invest"}
        </button>
      </div>
      <div className="mt-4">
        <p className="text-lg">{item?.metadata?.name}</p>
      </div>
      {item?.metadata?.cover && (
        <div className="mt-4 justify-center items-center">
          <img
            src={getIPFSLink(getRawurl(item?.metadata?.cover))}
            alt=""
            className="object-contain rounded-lg max-h-80"
          />
        </div>
      )}
    </div>
  );
};

export default Card;
