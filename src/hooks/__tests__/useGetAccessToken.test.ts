import { describe, test, expect, vi } from "vitest"
import { act, renderHook } from "@testing-library/react"
import useGetAccessToken from "@/hooks/useGetAccessToken"

describe("useGetAccessToken", () => {
  test("returns null state", () => {
    const { result } = renderHook(() => useGetAccessToken())
    expect(result.current).toEqual({
      getATWithAuthCode: expect.any(Function),
      getATWithRefreshToken: expect.any(Function),
      isLoading: false,
      error: null,
      tokens: null
    })
  })

  test("returns access tokens", async () => {
    vi.mock("@/apis/token", async () => ({
      postToken: vi.fn(() => Promise.resolve({
        refresh_token: "refresh_token_jwt", access_token: "access_token_jwt"
      }))
    }))

    const { result } = renderHook(
      () => useGetAccessToken()
    )

    act(() => {
      result.current.getATWithAuthCode("code", "codeVerifier")
    })

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

    vi.unmock("@/apis/token")
  })

  test("captures error", async () => {
    vi.mock("@/apis/token", async () => ({
      postToken: vi.fn(() => Promise.reject(new Error("error")))
    }))

    const { result } = renderHook(() =>
      useGetAccessToken()
    )

    act(() => {
      result.current.getATWithAuthCode("code", "codeVerifier")
    })

    expect(result.current.isLoading).toBeTruthy()
    expect(result.current.error).toBeNull()

    vi.waitFor(() => {
      expect(result.current.tokens).toBeNull()
      expect(result.current.isLoading).toBeFalsy()
      expect(result.current.error).toBe("error")
    })
    vi.unmock("@/apis/token")
  })
})
