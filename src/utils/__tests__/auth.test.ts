import { describe, test, expect, vi, afterAll } from "vitest"
import { getPKCEStatus, redirectToLogin, createPKCECodes } from "../auth"
import config from "@/config"

describe("getPKCEStatus", () => {
  test("returns false on empty state", () => {
    expect(getPKCEStatus()).toEqual({ isDone: false, codeVerifier: null, })
    expect(getPKCEStatus('state')).toEqual({ isDone: false, codeVerifier: null, })
  })

  test("returns true on state and code", () => {
    document.cookie = 'app.txs.state-uuid=code_verifier'
    expect(getPKCEStatus('state-uuid')).toEqual({
      isDone: true,
      codeVerifier: 'code_verifier'
    })
  })
})

describe("createPKCECodes", () => {
  test("returns codeVerifier, codeChallenge, state", async () => {
    const codes = await createPKCECodes()
    expect(codes).toMatchObject({
      codeVerifier: expect.any(String),
      codeChallenge: expect.any(String),
      state: expect.any(String)
    })
  })
})

describe("redirectToLogin", () => {
  afterAll(() => {
    vi.unstubAllGlobals()
  })

  test("redirects to login url", async () => {
    const state = 'state'
    const codeChallenge = 'code_challenge'
    const redirect = vi.fn()

    const query = new URLSearchParams()
    query.append('response_type', 'code,id_token')
    query.append('redirect_uri', config.BASE_URL)
    query.append('state', state)
    query.append('code_challenge', codeChallenge)

    const url = `${config.LOGIN_URL}?${query.toString()}`
    vi.stubGlobal('location', { replace: redirect })

    redirectToLogin(state, codeChallenge)

    expect(redirect).toHaveBeenCalledWith(url)
  })
})
