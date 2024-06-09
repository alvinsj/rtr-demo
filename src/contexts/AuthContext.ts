import { createContext } from "use-context-selector"

export type AuthContextType = {
  readonly accessToken: string | null;
  readonly refreshToken: string | null;
  setAccessToken(token: string): void;
  setRefreshToken(token: string): void;
}

const AuthContext = createContext<AuthContextType>({
  accessToken: null,
  refreshToken: null,
  setAccessToken: () => { },
  setRefreshToken: () => { }
})

export default AuthContext
