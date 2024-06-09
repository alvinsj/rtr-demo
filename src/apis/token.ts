import config from "@/config"
import { PostTokenSchema } from "@/types"

let abortController: AbortController | undefined
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
    if (abortController)
      abortController.abort("Abort the previous request")
    abortController = new AbortController()

    const response = await fetch(request, { signal: abortController.signal })
    if (!response.ok || response.status >= 400 || response.status < 200) {
      throw new Error(response.statusText)
    }
    const res = await response.json()
    const tokenResponse = PostTokenSchema.parse(res)

    // FIXME for more error handling of different response
    return tokenResponse
  } catch (error) {

    if (typeof error === 'string' && error === 'Abort the previous request')
      return {}

    if (error instanceof Error) throw error

    throw new Error('postTokens - An unknown error occurred')
  }
}
