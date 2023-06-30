import { AuthStore } from "@/types/store";
import { create } from "zustand";

const useAuthStore = create<AuthStore>((set) => ({
  isConnected: false,
  isLensAuthenticated: false,
  accessToken: "",
  refreshToken: "",
  userEthAddress: "",
  hasHandle: false,
  setIsConnected: (connected) =>
    set((state) => ({ ...state, isConnected: connected })),
  setIsLensAuthenticated: (authenticated) =>
    set((state) => ({ ...state, isLensAuthenticated: authenticated })),
  setAccessToken: (token) => set((state) => ({ ...state, accessToken: token })),
  setRefreshToken: (token) =>
    set((state) => ({ ...state, refreshToken: token })),
  setUserEthAddress: (address) =>
    set((state) => ({ ...state, userEthAddress: address })),
  setHasHandle: (hasHandle) =>
    set((state) => ({ ...state, hasHandle: hasHandle })),
}));

export default useAuthStore;
