import config from "@/config"
import { c } from "node_modules/vite/dist/node/types.d-aGj9QkWt"

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
    const res = await response.json()

    if (!response.ok) {
      throw new Error(res.error)
    }
    // FIXME for more error handling of different response
    return res

  } catch (error) {
    if (typeof error === 'string' && error === 'Abort the previous request')
      return {}

    throw new Error(
      (error as Error)?.message
      ?? 'postTokens - An unknown error occurred'
    )
  }
}
