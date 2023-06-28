import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

type InvestedCampaignsProps = {
  address: string;
};

async function getInvestedCampaigns({ address }: InvestedCampaignsProps) {
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
      sender: address,
    });
    console.log("All Streams", allStream.items);

    return allStream.items;
  } catch (error) {
    throw new Error("Failed to get your investments :(");
  }
}
export default getInvestedCampaigns;
