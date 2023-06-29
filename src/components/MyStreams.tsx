import useProfileStore from "@/store/profileStore";
import {
  Framework,
  IStream,
  ISuperTokenDeleteFlowParams,
} from "@superfluid-finance/sdk-core";
import { ethers } from "ethers";
import React, { useState } from "react";

function MyStreams() {
  const { currentProfile } = useProfileStore();

  const [allStreams, setAllStreams] = useState<IStream[]>([]);
  const [deletingStream, setDeletingStream] = useState(false);

  async function getMyStreams() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    await provider.send("eth_requestAccounts", []);

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
    const MSG_HASH =
      "0x000000000000000000000000000000000000000000000000000000000000002000000000000000000000000000000000000000000000000000000000000000164372656174656420766961205375706572526169736500000000000000000000";
    console.log("All Streams", allStream.items);
    const appStreams = allStream.items.filter(
      (stream) => stream?.userData === MSG_HASH
    );
    console.log(appStreams);
    setAllStreams(appStreams);
  }

  async function deleteStream({
    receiver,
    sender,
  }: ISuperTokenDeleteFlowParams) {
    try {
      setDeletingStream(true);
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

      const superToken = await SDKInstance.loadSuperToken("fDAIx");

      const callDelete = superToken.deleteFlow({
        receiver: receiver,
        sender: sender,
      });
      console.log("Deleting Stream");
      const superSigner = SDKInstance.createSigner({ signer: signer });
      const txn = await callDelete.exec(superSigner);
      await txn.wait();
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        if (error.message.includes("user rejected transaction")) {
          alert("Transaction cancelled by user");
        }
      }
    } finally {
      setDeletingStream(false);
    }
  }

  React.useEffect(() => {
    getMyStreams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [deletingStream]);

  return (
    <div className="relative overflow-x-auto w-full mx-96">
      <table className="w-auto text-sm text-left text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="px-6 py-3">
              Token Streamed
            </th>
            <th scope="col" className="px-6 py-3">
              Receiving Address
            </th>
            <th scope="col" className="px-6 py-3">
              Flow Rate
            </th>
            <th scope="col" className="px-6 py-3">
              Active ?
            </th>
            <th scope="col" className="px-6 py-3">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {allStreams.length > 0 &&
            allStreams.map((stream) => {
              const streamToken = stream.token.name;
              return (
                <tr
                  key={stream.id}
                  className="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                >
                  <th
                    scope="row"
                    className="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                  >
                    {streamToken}
                  </th>
                  <td className="px-6 py-4">{stream.receiver}</td>
                  <td className="px-6 py-4">
                    {ethers.utils.formatEther(stream.currentFlowRate)}{" "}
                    {stream.token.symbol}/s
                  </td>
                  <td className="px-6 py-4">
                    {stream.currentFlowRate === "0" ? "No" : "Yes"}
                  </td>
                  <td className="px-6 py-4">
                    {stream.currentFlowRate !== "0" ? (
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          deleteStream({
                            receiver: stream.receiver,
                            sender: stream.sender,
                          });
                        }}
                      >
                        {deletingStream ? "Deleting..." : "Cancel Stream"}
                      </button>
                    ) : (
                      <button>See More</button>
                    )}
                  </td>
                </tr>
              );
            })}
        </tbody>
      </table>
    </div>
  );
}

export default MyStreams;
