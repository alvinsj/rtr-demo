import { describe, test, expect } from "vitest"
import { getStateCookie, createStateCookie } from "../stateCookie"

describe("createStateCookie", () => {
  test("throws errors on empty string", () => {
    expect(() => createStateCookie(""))
      .toThrow("state value is required")
  })

  test("sets cookie with prefix app.txs", () => {
    const state = createStateCookie("code_verifier_secret")
    expect(document.cookie)
      .toMatch(`app.txs.${state}=code_verifier_secret`)
  })

  test("sets cookie with latest value", () => {
    const state = createStateCookie("code_verifier_secret")
    expect(document.cookie)
      .toMatch(`app.txs.${state}=code_verifier_secret`)
  })

  test("returns state", () => {
    const state = createStateCookie("code_verifier_secret")
    expect(state).toMatch(/[\w-]+/)
  })
})

describe("getStateCookie", () => {
  test("gets cookie", () => {
    const state = crypto.randomUUID()
    const random = Math.random().toString(36).substring(7)
    document.cookie = `app.txs.${state}=${random}`
    expect(getStateCookie(state)).toBe(random)
  })

  test("gets none", () => {
    expect(getStateCookie('nothere')).toBeUndefined()
  })
})
