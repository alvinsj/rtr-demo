import { describe, test, expect } from "vitest"
import { getAuthStage, } from "../authStage"
import { AuthStage } from '@/types'

describe("getAuthStage", () => {
  test("returns LOGGED_OUT", () => {
    const result = getAuthStage({
      state: null,
      code: null,
      accessToken: null,
      refreshToken: null,
      codeVerifier: null,
    })
    expect(result).toEqual({
      stage: AuthStage.LOGGED_OUT
    })
  })

  test("returns LOGGED_IN", () => {
    const accessToken = "mock_access_token"
    const refreshToken = "mock_refresh_token"
    const result = getAuthStage({
      state: null,
      code: null,
      accessToken,
      refreshToken,
      codeVerifier: null,
    })
    expect(result).toEqual({
      stage: AuthStage.LOGGED_IN,
      accessToken
    })
  })

  test("returns BEFORE_REFRESH_TOKEN", () => {
    const refreshToken = "mock_refresh_token"
    const result = getAuthStage({
      state: 'mock_state',
      code: 'mock_code',
      accessToken: null,
      refreshToken,
      codeVerifier: null,
    })
    expect(result).toEqual({
      stage: AuthStage.BEFORE_REFRESH_TOKEN,
      refreshToken
    })
  })

  test("returns BEFORE_AUTH_CODE", () => {
    const state = "mock_state"
    const code = "mock_code"
    const codeVerifier = "mock_code_verifier"
    const result = getAuthStage({
      state,
      code,
      accessToken: null,
      refreshToken: null,
      codeVerifier,
    })
    expect(result).toEqual({
      stage: AuthStage.BEFORE_AUTH_CODE,
      state,
      code,
      codeVerifier
    })
  })

  test("returns AFTER_AUTH_CODE", () => {
    const state = "mock_state"
    const code = "mock_code"
    const codeVerifier = "mock_code_verifier"
    const accessToken = "mock_access_token"
    const refreshToken = "mock_refresh_token"
    const result = getAuthStage({
      state,
      code,
      accessToken,
      refreshToken,
      codeVerifier,
    })
    expect(result).toEqual({
      stage: AuthStage.AFTER_AUTH_CODE,
      state
    })
  })

  test("returns LOGGED_OUT when verifier not found", () => {
    const state = "mock_state"
    const code = "mock_code"
    const result = getAuthStage({
      state,
      code,
      accessToken: null,
      refreshToken: null,
      codeVerifier: null,
    })
    expect(result).toEqual({
      stage: AuthStage.LOGGED_OUT
    })
  })

  test("returns LOGGED_OUT when state or code not found", () => {
    const state = "mock_state"
    const result1 = getAuthStage({
      state,
      code: null,
      accessToken: null,
      refreshToken: null,
      codeVerifier: null,
    })
    expect(result1).toEqual({
      stage: AuthStage.LOGGED_OUT,
    })

    const code = "mock_code"
    const result2 = getAuthStage({
      state: null,
      code,
      accessToken: null,
      refreshToken: null,
      codeVerifier: null,
    })
    expect(result2).toEqual({
      stage: AuthStage.LOGGED_OUT,
    })
  })
})

