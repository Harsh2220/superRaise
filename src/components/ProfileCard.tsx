import React from "react";
import Avatar from "./UI/Avatar";
import getIPFSLink from "@/utils/getIPFSLink";
import getRawurl from "@/utils/getRawURL";
import { Profile, Scalars } from "@/lens";
import getDefaultProfile from "@/utils/getDefaultProfile";

export default function ProfileCard({
  address,
}: {
  address: Scalars["EthereumAddress"];
}) {
  const [profile, setProfile] = React.useState<Profile | undefined>(undefined);

  async function getProfile() {
    const defaultProfile = await getDefaultProfile(address);
    setProfile(defaultProfile);
  }

  React.useEffect(() => {
    getProfile();
  }, []);

  return (
    <div className="flex items-center">
      <Avatar
        src={getIPFSLink(getRawurl(profile?.picture))}
        height={40}
        width={40}
      />
      <div className="ml-2">
        <h1 className="text-md leading-3 font-medium">{profile?.name}</h1>
        <p className="text-gray-500 text-sm">{profile?.handle}</p>
      </div>
    </div>
  );
}
