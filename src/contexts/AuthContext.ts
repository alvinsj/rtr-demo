import { createContext } from "use-context-selector"

export type AuthContextType = {
  accessToken?: string,
  refreshToken?: string | null,
}

const AuthContext = createContext<AuthContextType>({})

export default AuthContext
