"use client";

/* eslint-disable @next/next/no-img-element */
import useProfileStore from "@/store/profileStore";
import { SuperTokens } from "@/types";
import createInvestStream from "@/utils/createFlow";
import getInvestedCampaigns from "@/utils/getInvestedCampaigns";
import React from "react";
import toast from "react-hot-toast";
import Avatar from "./UI/Avatar";

type CampaignCardProps = {};

const Card: React.FC<CampaignCardProps> = () => {
  const { currentProfile } = useProfileStore();
  React.useEffect(() => {
    getInvestedCampaigns({ address: currentProfile?.ownedBy }).then((res) => {
      //Filter fhere by app_id
      console.log(res);
    });
  }, [currentProfile?.ownedBy]);
  return (
    <div className="max-w-2xl p-8 bg-white rounded-lg m-8 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Avatar src={""} height={40} width={40} />
          <div className="ml-2">
            <h1 className="text-md leading-3 font-medium">Harsh Sachaniya</h1>
            <p className="text-gray-500 text-sm">@iamharsh</p>
          </div>
        </div>
        <button
          className="inline-flex items-center justify-center px-6 py-2 text-base font-semibold transition-all duration-200 rounded-md bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600"
          onClick={(e) => {
            e.preventDefault();
            const streamConfig = {
              flowRate: "150",
              receiverAddress: currentProfile?.ownedBy,
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
              });
          }}
        >
          Invest
        </button>
      </div>
      <div className="mt-4">
        <p className="text-lg">nothing</p>
      </div>
      <div className="mt-4 justify-center items-center">
        <img
          src={
            "https://images.unsplash.com/photo-1682687982046-e5e46906bc6e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDF8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1170&q=80"
          }
          alt=""
          className="object-contain rounded-lg max-h-80"
        />
      </div>
    </div>
  );
};
export default Card;
