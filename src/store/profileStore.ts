import { create } from "zustand";
import { Profile } from "@/lens";
import { ProfileStore } from "@/types/store";


const useProfileStore = create<ProfileStore>((set) => ({
  currentProfile: undefined,
  setCurrentProfile: (profile) =>
    set((state) => ({ ...state, currentProfile: profile })),
}));

export default useProfileStore;
