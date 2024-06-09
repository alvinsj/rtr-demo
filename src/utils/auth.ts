import {
  deleteStateCookie,
  getStateCookie,
  createStateCookie
} from "@/utils/stateCookie"
import {
  createPKCECodeChallenge,
  createRandomString
} from "@lib/pkce"
import { PKCEState } from "@/types"
import config from "@/config"

export const createPKCECodes = async () => {
  const codeVerifier = createRandomString()
  const codeChallenge = await createPKCECodeChallenge(codeVerifier)
  const state = createStateCookie(codeVerifier)

  return { codeVerifier, codeChallenge, state }
}

export const redirectToLogin = async (
  state: string, codeChallenge: string
) => {
  const query = new URLSearchParams()
  query.append('response_type', 'code,id_token')
  query.append('redirect_uri', config.BASE_URL)
  query.append('state', state)
  query.append('code_challenge', codeChallenge)

  window.location.replace(`${config.LOGIN_URL}?${query.toString()}`)
}

export const getPKCEStatus = (state?: string): PKCEState => {
  // guard: pkce is not initialized yet
  if (!state) {
    return { isDone: false }
  }

  const codeVerifier = getStateCookie(state)
  if (!codeVerifier) return { isDone: false }

  return {
    isDone: true,
    codeVerifier,
  }
}
