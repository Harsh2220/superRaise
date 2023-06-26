export interface AuthStore {
  isConnected: boolean;
  isLensAuthenticated: boolean;
  accessToken: string;
  refreshToken: string;
  userEthAddress: string;
  hasHandle: boolean;
  setIsConnected: (connected: boolean) => void;
  setIsLensAuthenticated: (authenticated: boolean) => void;
  setAccessToken: (token: string) => void;
  setRefreshToken: (token: string) => void;
  setUserEthAddress: (address: string) => void;
  setHasHandle: (hasHandle: boolean) => void;
}
