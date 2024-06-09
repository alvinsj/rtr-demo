import { describe, test, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"
import useGetAccessTokenEffect from "@/hooks/useGetAccessTokenEffect"

describe("useGetAccessTokenEffect", () => {
  test("returns null state", () => {
    const { result } = renderHook(() => useGetAccessTokenEffect(null, null, undefined))
    expect(result.current).toEqual({
      isLoading: false,
      error: null,
      tokens: null
    })
  })

  test("returns access tokens", async () => {
    vi.mock("@/apis/token", async () => ({
      postTokens: vi.fn(() => Promise.resolve({
        refresh_token: "refresh_token_jwt", access_token: "access_token_jwt"
      }))
    }))

    const { result } = renderHook(
      () => useGetAccessTokenEffect("state", "code", "codeVerifier")
    )

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.error).toBeFalsy()

    vi.waitFor(() => {
      expect(result.current.tokens).toEqual({
        accessToken: "access_token_jwt",
        refreshToken: "refresh_token_jwt"
      })
      expect(result.current.isLoading).toBeFalsy()
      expect(result.current.error).toBeFalsy()
    })
  })

  test("captures error", async () => {
    vi.mock("@/apis/token", async () => ({
      postTokens: vi.fn(() => Promise.reject(new Error("error")))
    }))

    const { result } = renderHook(() =>
      useGetAccessTokenEffect("state", "code", "codeVerifier"))

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.error).toBeNull()
    await vi.waitFor(() => expect(result.current.error).toBe("error"))
  })
})
