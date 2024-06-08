import {
  deleteStateCookie,
  getStateCookie,
  createStateCookie
} from "@/lib/stateCookie"
import {
  createPKCECodeChallenge,
  createRandomString
} from "@/lib/pkce"
import { PKCEState } from "@/types"
import config from "@/config"

export const getPKCEState = (state?: string, code?: string): PKCEState => {
  // guard: pkce is not initialized yet
  if (!state || !code) {
    return { isReady: false }
  }

  const codeVerifier = getStateCookie(state)
  if (!codeVerifier) return { isReady: false }

  return {
    isReady: true,
    codeVerifier,
    code
  }
}

export const redirectAuthRequestE = async (
  state: string, codeChallenge: string
) => {
  const query = new URLSearchParams()
  query.append('response_type', 'code,id_token')
  query.append('redirect_uri', config.BASE_URL)
  query.append('state', state)
  query.append('code_challenge', codeChallenge)

  window.location.replace(`${config.LOGIN_URL}?${query.toString()}`)
}

export const postForTokens = async (code: string, codeVerifier: string) => {
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
    const response = await fetch(request)
    const res = await response.json()

    if (!response.ok) {
      throw new Error(res.error)
    }
    // FIXME for more error handling of different response
    return res

  } catch (error) {
    if (error instanceof Error)
      throw new Error(error?.message)
    else throw new Error('An unknown error occurred')
  }
}

export const getPKCECodes = async () => {
  const codeVerifier = createRandomString()
  const codeChallenge = await createPKCECodeChallenge(codeVerifier)
  const state = createStateCookie(codeVerifier)

  return { codeVerifier, codeChallenge, state }
}
