import { createContext, useContext } from "react";

const ProfileStaticDataContext = createContext(null);

export function useProfileStaticDataContext() {
  return useContext(ProfileStaticDataContext);
}

export default ProfileStaticDataContext;