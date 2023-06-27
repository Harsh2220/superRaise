"use client";

import useAuthStore from "@/store/authStore";
/* eslint-disable @next/next/no-img-element */
import { APP_DESCRIPTION, APP_NAME, APP_TAG } from "@/constants";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();
  const { isLensAuthenticated } = useAuthStore();

  return (
    <div className="absolute top-0 -z-10">
      <section className="bg-yellow-50 overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-stretch lg:min-h-[100vh]">
          <div className="relative flex items-center justify-center w-full lg:order-2 lg:w-7/12">
            <div className="absolute bottom-0 right-0 hidden lg:block">
              {APP_NAME}
            </div>

            <div className="relative px-4 pt-24 pb-16 text-center sm:px-6 md:px-24 2xl:px-32 lg:py-24 lg:text-left">
              <h1 className="text-4xl font-bold text-black sm:text-6xl xl:text-7xl">
                {APP_TAG}
              </h1>
              <p className="mt-8 text-xl text-black">{APP_DESCRIPTION}</p>
              <a
                href="#"
                title=""
                className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold transition-all duration-200 rounded-full bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600 mt-8"
                role="button"
              >
                Explore {"->"}
              </a>
              {isLensAuthenticated && (
                <button
                  className="inline-flex items-center justify-center px-5 py-2.5 text-base font-semibold transition-all duration-200 rounded-full bg-orange-500 text-white hover:bg-orange-600 focus:bg-orange-600 mt-8"
                  onClick={(e) => {
                    e.preventDefault();
                    router.push("/upload");
                  }}
                >
                  Create Campaign {"->"}
                </button>
              )}
            </div>
          </div>

          <div className="relative w-full overflow-hidden lg:order-1 h-96 lg:h-auto lg:w-5/12">
            <div className="absolute inset-0">
              <img
                className="object-cover w-full h-full scale-150"
                src="https://cdn.rareblocks.xyz/collection/celebration/images/hero/3/man-working-on-laptop.jpg"
                alt=""
              />
            </div>

            <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent"></div>

            <div className="absolute bottom-0 left-0">
              <div className="p-4 sm:p-6 lg:p-8">
                <div className="flex items-center">
                  <svg
                    className="w-10 h-10 text-orange-500"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.3 1.046A1 1 0 0112 2v5h4a1 1 0 01.82 1.573l-7 10A1 1 0 018 18v-5H4a1 1 0 01-.82-1.573l7-10a1 1 0 011.12-.38z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
