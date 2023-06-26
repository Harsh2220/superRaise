import { create } from "zustand";
import { Profile } from "@/lens";

interface ProfileStore {
  currentProfile: Profile | undefined;
  setCurrentProfile: (profile: Profile | undefined) => void;
}

const useProfileStore = create<ProfileStore>((set) => ({
  currentProfile: undefined,
  setCurrentProfile: (profile) =>
    set((state) => ({ ...state, currentProfile: profile })),
}));

export default useProfileStore;
