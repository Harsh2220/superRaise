"use client";

import React, { useEffect } from "react";
import Avatar from "./UI/Avatar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useSignMessage } from "wagmi";
import useAuthStore from "@/store/authStore";
import useProfileStore from "@/store/profileStore";
import { useAuthenticateMutation, useChallengeLazyQuery } from "@/lens";
import getDefaultProfile from "@/utils/getDefaultProfile";
import { toast } from "react-hot-toast";
import { APP_NAME } from "@/constants";
import getIPFSLink from "@/utils/getIPFSLink";
import getRawurl from "@/utils/getRawURL";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const { isConnected, address } = useAccount();
  const {
    setIsConnected,
    setUserEthAddress,
    setAccessToken,
    setRefreshToken,
    setHasHandle,
    hasHandle,
    setIsLensAuthenticated,
    isLensAuthenticated,
  } = useAuthStore();
  const { currentProfile, setCurrentProfile } = useProfileStore();
  const [getChallengeText] = useChallengeLazyQuery();
  const [getTokens] = useAuthenticateMutation();
  const signer = useSignMessage();
  const router = useRouter();

  useEffect(() => {
    if (isConnected) {
      setIsConnected(true);
      setUserEthAddress(address as string);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  useEffect(() => {
    getDefaultProfile(address).then((profile) => {
      if (profile) {
        setHasHandle(true);
        setCurrentProfile(profile);
      }
      if (!profile) {
        setHasHandle(false);
        return;
      }
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected]);

  const goToLensClaim = () => {
    window.open("https://claim.lens.xyz", "blank");
  };

  const loginWithLens = async () => {
    try {
      const challengeText = await getChallengeText({
        variables: {
          request: {
            address: address,
          },
        },
      });
      if (challengeText.data) {
        const signature = await signer.signMessageAsync({
          message: challengeText?.data?.challenge?.text,
        });

        const authTokens = await getTokens({
          variables: {
            request: {
              address: address,
              signature: signature,
            },
          },
        });
        if (authTokens.data) {
          setIsLensAuthenticated(true);
          setAccessToken(authTokens.data.authenticate.accessToken);
          setRefreshToken(authTokens.data.authenticate.refreshToken);
        }
      }
    } catch (error) {
      console.log(error);
      if (error instanceof Error) {
        toast(error.message);
      }
    }
  };

  return (
    // <header className="z-10 w-full sticky top-0">
    //   <div className="px-4 mx-auto sm:px-6 lg:px-8">
    //     <div className="flex items-center justify-between h-16 lg:h-20">
    //       <div className="flex-shrink-0">{APP_NAME}</div>

    //       <button
    //         type="button"
    //         className="inline-flex p-2 text-black transition-all duration-200 rounded-md lg:hidden focus:bg-gray-100 hover:bg-gray-100"
    //       >
    //         {/* <!-- Menu open: "hidden", Menu closed: "block" --> */}
    //         <svg
    //           className="block w-6 h-6"
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           stroke="currentColor"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth="2"
    //             d="M4 6h16M4 12h16m-7 6h7"
    //           />
    //         </svg>

    //         {/* <!-- Menu open: "block", Menu closed: "hidden" --> */}
    //         <svg
    //           className="hidden w-6 h-6"
    //           xmlns="http://www.w3.org/2000/svg"
    //           fill="none"
    //           viewBox="0 0 24 24"
    //           stroke="currentColor"
    //         >
    //           <path
    //             strokeLinecap="round"
    //             strokeLinejoin="round"
    //             strokeWidth="2"
    //             d="M6 18L18 6M6 6l12 12"
    //           ></path>
    //         </svg>
    //       </button>

    //       <div className="hidden ml-auto lg:flex lg:items-center lg:justify-center lg:space-x-10">
    //         {!isConnected ? (
    //           <ConnectButton showBalance={false} />
    //         ) : (

    //         )}
    //       </div>
    //     </div>
    //   </div>
    // </header>
    <header className="z-10 w-full">
      <div className="px-4 mx-auto sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <div className="flex-shrink-0">
            <a
              href="/"
              title=""
              className="flex justify-center items-center mr-4"
            >
              <img className="w-auto h-8" src="./Superraise.png" alt="" />
              <p className="text-white text-xl font-bold ml-1">SuperRaise</p>
            </a>
          </div>

          {/* <div className="hidden lg:flex lg:items-center lg:justify-center lg:space-x-10">
                <a href="#" title="" className="text-base text-white transition-all duration-200 hover:text-opacity-80"> Features </a>

                <a href="#" title="" className="text-base text-white transition-all duration-200 hover:text-opacity-80"> Solutions </a>

                <a href="#" title="" className="text-base text-white transition-all duration-200 hover:text-opacity-80"> Resources </a>

                <a href="#" title="" className="text-base text-white transition-all duration-200 hover:text-opacity-80"> Pricing </a>
            </div> */}

          <div className="lg:flex lg:items-center lg:justify-end lg:space-x-6 sm:ml-auto">
            {!isConnected ? (
              <ConnectButton showBalance={false} />
            ) : (
              <>
                {isLensAuthenticated ? (
                  <div className="flex items-center">
                    <div className="flex items-center mr-8 space-x-8">
                      <button
                        className="text-base font-semibold text-white transition-all duration-200 hover:text-opacity-80"
                        onClick={() => {
                          router.push("/feed");
                        }}
                      >
                        Campaigns
                      </button>
                      <button
                        className="text-base font-semibold text-white transition-all duration-200 hover:text-opacity-80"
                        onClick={() => {
                          router.push("/myinvestments");
                        }}
                      >
                        Your Investments
                      </button>
                      <button
                        className="text-base font-semibold text-white transition-all duration-200 hover:text-opacity-80"
                        onClick={() => {
                          router.push("/upload");
                        }}
                      >
                        Create
                      </button>
                    </div>
                    <Avatar
                      height={35}
                      width={35}
                      src={getIPFSLink(getRawurl(currentProfile?.picture))}
                    />
                  </div>
                ) : (
                  <button  onClick={hasHandle ? loginWithLens : goToLensClaim}>
                  <a
                    href="#"
                    title=""
                    className="inline-flex items-center justify-center px-3 sm:px-5 py-2.5 text-sm sm:text-base font-semibold transition-all duration-200 text-white bg-white/20 hover:bg-white/40 focus:bg-white/40 rounded-lg"
                    role="button"
                  >
                     {hasHandle ? "Login with Lens" : "Claim Lens handle"}
                  </a>
                </button>
                )}
              </>
              // <>
              //   <a
              //     href="#"
              //     title=""
              //     className="hidden text-base text-white transition-all duration-200 lg:inline-flex hover:text-opacity-80"
              //   >
              //     {" "}
              //     Log in{" "}
              //   </a>

               
              // </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
