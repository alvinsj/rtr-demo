import config from "@/config"

let abortController: AbortController = new AbortController()
export const postTokens = async (code: string, codeVerifier: string) => {
  const body = JSON.stringify({
    code,
    code_verifier: codeVerifier,
    grant_type: 'authorization_code'
  })

  const request = new Request(config.TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body
  })

  try {
    abortController.abort()
    abortController = new AbortController()

    const response = await fetch(request, { signal: abortController.signal })
    const res = await response.json()

    if (!response.ok) {
      throw new Error(res.error)
    }
    // FIXME for more error handling of different response
    return res

  } catch (error) {

    throw new Error(
      (error as Error)?.message
      ?? 'An unknown error occurred'
    )
  }
}
