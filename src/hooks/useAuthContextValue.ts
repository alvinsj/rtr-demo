import { useState, useMemo, useEffect } from 'react'
import { getRefreshToken, setRefreshToken } from '@/utils/token'

const useAuthContextValue = (tokens: AuthTokens) => {
  const [accessToken, setAccessToken] = useState<string | null>(null)

  useEffect(() => {
    if (tokens && tokens.accessToken && tokens.refreshToken) {
      setAccessToken(tokens.accessToken)
      setRefreshToken(tokens.refreshToken)
    }
  }, [tokens])

  return useMemo(() => {
    return {
      get accessToken(): string | null {
        return accessToken ?? null
      },
      get refreshToken(): string | null {
        return getRefreshToken()
      },
      setAccessToken(token: string) {
        setAccessToken(token)
      },
      setRefreshToken(token: string) {
        setRefreshToken(token)
      }
    }
  }, [accessToken])
}

export default useAuthContextValue
