import { useEffect, useState } from 'react'

import { postTokens } from '@/apis/postToken'
import { deleteStateCookie } from '@/utils/stateCookie'

const useGetAccessTokenEffect = (
  state: string | null,
  code: string | null,
  codeVerifier: string | undefined
) => {

  const [isLoading, setIsLoading] = useState(false)
  const [tokens, setTokens] = useState<{ accessToken: string, refreshToken: string } | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (state && code && codeVerifier) {
      setIsLoading(true)
      setError(null)
      postTokens(code, codeVerifier!)
        .then((res) => setTokens({
          accessToken: res.access_token,
          refreshToken: res.refresh_token
        }))
        .catch((err) =>
          setError(
            err?.message
            ?? 'useGetAccessTokenEffect - An unknown error occurred'
          )
        )
        .finally(() => {
          deleteStateCookie(state)
          window.history.replaceState({}, document.title, '/')
          setIsLoading(false)
        })
    }

    // on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return { isLoading, error, tokens }
}

export default useGetAccessTokenEffect
