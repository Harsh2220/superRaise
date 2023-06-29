import { CreateInvestmentOptios } from "@/types";
import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import { APP_NAME } from "./../constants/index";

export default async function createInvestStream({
  streamToken,
  senderAddress,
  flowRate = "250000",
  receiverAddress,
}: CreateInvestmentOptios) {
  try {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();

    const SDKInstance = await Framework.create({
      chainId: 80001,
      provider: provider,
    });

    const superSigner = SDKInstance.createSigner({ signer: signer });

    // console.log("Super-fluid signer", signer);

    const superToken = await SDKInstance.loadSuperToken("fDAIx");
    // console.log("Super Token", superToken);
    const balance = await superToken.balanceOf({
      account: senderAddress,
      providerOrSigner: signer,
    });
    // console.log("User Super Token balance", balance);

    if (balance === "0") {
      throw new Error("Insufficient Funds...");
    }

    const userData = ethers.utils.defaultAbiCoder.encode(
      ["string"],
      [`Created via ${APP_NAME}`]
    );
    const streamConfig = {
      sender: await superSigner.getAddress(),
      receiver: receiverAddress,
      flowRate: flowRate,
      userData,
      overrides: {
        gasLimit: "1000000",
      },
    };

    const createFlowOperation = superToken.createFlow(streamConfig);
    console.log(createFlowOperation);

    // console.log("Creating your stream...");

    const result = await createFlowOperation.exec(superSigner);
    console.log(result);
    await result.wait();
    console.log(`Congrats - you've just created a money stream!`);
    return "Stream CreatedSuccesfully";
  } catch (error) {
    console.log(error)
    if (error instanceof Error) {
      if (error.message.includes("rejected transaction")) {
        throw new Error("Transaction cancelled by user");
      } else {
        throw new Error("Error in creating stream");
      }
    }
  }
}
