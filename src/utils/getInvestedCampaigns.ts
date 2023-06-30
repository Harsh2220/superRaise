import { Framework, IStreamRequestFilter } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

type UserStreamRequestOptions = Required<Pick<IStreamRequestFilter, "sender">> &
  Partial<Omit<IStreamRequestFilter, "sender">>;

async function getInvestedCampaigns({ sender }: UserStreamRequestOptions) {
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
      sender: sender,
    });
    console.log("All Streams", allStream.items);

    return allStream.items;
  } catch (error) {
    throw new Error("Failed to get your investments :(");
  }
}
export default getInvestedCampaigns;
