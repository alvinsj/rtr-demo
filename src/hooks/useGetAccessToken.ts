import { useCallback, useState } from 'react'

import { postTokenWithAuthCode, postTokenWithRefreshToken } from '@/apis/token'
import { AuthTokens, PostTokenResponse } from '@/types'
import { deleteRefreshToken } from '@/utils/token'
import { deleteStateCookie } from '@/utils/stateCookie'

const useGetAccessToken = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [tokens, setTokens] = useState<AuthTokens>({
    accessToken: null,
    refreshToken: null
  })
  const [error, setError] = useState<string | null>(null)

  const getATWithAuthCode = useCallback(async (
    state: string,
    code: string,
    codeVerifier: string
  ) => {
    setIsLoading(true)
    setError(null)
    await postTokenWithAuthCode(code, codeVerifier!)
      .then((res: PostTokenResponse) => {
        setTokens({
          accessToken: res.access_token,
          refreshToken: res.refresh_token
        })
      })
      .catch((err) => {
        deleteStateCookie(state)
        setError(
          err?.message
          ?? 'getATWithAuthCode - An unknown error occurred'
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  // FIXME refactor duplicated code
  const getATWithRefreshToken = useCallback(async (refreshToken: string) => {
    setIsLoading(true)
    setError(null)
    await postTokenWithRefreshToken(refreshToken)
      .then((res: PostTokenResponse) => {
        setTokens({
          accessToken: res.access_token,
          refreshToken: res.refresh_token
        })
      })
      .catch((err) => {
        deleteRefreshToken()
        setError(
          err?.message
          ?? 'getATWithRefreshToken - An unknown error occurred'
        )
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  return {
    isLoading, error, tokens,
    getATWithAuthCode, getATWithRefreshToken
  }
}

export default useGetAccessToken
