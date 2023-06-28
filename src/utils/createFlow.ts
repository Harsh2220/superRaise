import { Framework } from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";

declare global {
  interface Window {
    ethereum: any;
  }
}

export enum SuperTokens {
  TestMatic = "MATICx",
  TestDAI = "fDAIx",
}

type CreateInvestmentOptios = {
  streamToken: SuperTokens;
  senderAddress: string;
  receiverAddress: string;
  flowRate: string;
};

export default function createInvestStream({
  streamToken,
  senderAddress,
  flowRate,
  receiverAddress,
}: CreateInvestmentOptios) {
  return new Promise(async (resolve, reject) => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();

      const chainId = await window.ethereum.request({
        method: "eth_chainId",
      });

      const SDKInstance = await Framework.create({
        chainId: Number(chainId),
        provider: provider,
      });

      const superSigner = SDKInstance.createSigner({ signer: signer });

      console.log("Super-fluid signer", signer);
      const superToken = await SDKInstance.loadSuperToken(streamToken);
      console.log("Super Token", superToken);
      try {
        const balance = await superToken.balanceOf({
          account: senderAddress,
          providerOrSigner: signer,
        });
        console.log(balance)
        if (balance === "0") {
          return reject("Insufficient funds");
        }
        const createFlowOperation = superToken.createFlow({
          sender: await superSigner.getAddress(),
          receiver: receiverAddress,
          flowRate: flowRate,
        });

        console.log(createFlowOperation);

        console.log("Creating your stream...");

        const result = await createFlowOperation.exec(superSigner);
        console.log(result);
        await result.wait();
        console.log(`Congrats - you've just created a money stream!`);
        resolve("Stream created successfully");
      } catch (error) {
        console.error(error);
        reject(error);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log(error);
        if (error.message.includes("user rejected transaction")) {
          reject("Transaction cancelled by user");
        }
      }
      reject("Error in creating stream");
    }
  });
}