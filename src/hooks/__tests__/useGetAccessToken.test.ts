import { describe, test, expect, vi, afterEach } from "vitest"
import { act, renderHook } from "@testing-library/react"

import useGetAccessToken from "@/hooks/useGetAccessToken"
import { deleteRefreshToken } from "@/utils/refreshToken"
import { deleteStateCookie } from "@/utils/stateCookie"

describe("useGetAccessToken", () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.resetAllMocks()
  })

  test("returns initial state", () => {
    const { result } = renderHook(() => useGetAccessToken())
    expect(result.current).toEqual({
      getATWithAuthCode: expect.any(Function),
      getATWithRefreshToken: expect.any(Function),
      isLoading: false,
      error: null,
      tokens: {
        accessToken: null,
        refreshToken: null,
      }
    })
  })


  describe("auth token", () => {
    test("returns access tokens", async () => {
      const mockResponse = {
        access_token: 'access_token_jwt',
        refresh_token: 'refresh_token_jwt',
        expires_at: 1234567890
      }
      // FIXME unstable module mocking was replaced by fetch mock
      vi.stubGlobal('fetch', () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      }))

      const { result } = renderHook(() => useGetAccessToken())

      act(() => {
        result.current.getATWithAuthCode("state", "code", "codeVerifier")
      })
      expect(result.current.isLoading).toBeTruthy()
      expect(result.current.error).toBeFalsy()

      await vi.waitFor(() => {
        expect(result.current.tokens).toEqual({
          accessToken: "access_token_jwt",
          refreshToken: "refresh_token_jwt"
        })
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.error).toBeFalsy()
      })
    })

    test("captures error and delete state cookie", async () => {
      // FIXME unstable module mocking was replaced by fetch mock
      vi.stubGlobal('fetch', () => Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      }))
      vi.mock('@/utils/stateCookie', () => ({
        deleteStateCookie: vi.fn()
      }))

      const { result } = renderHook(() => useGetAccessToken())

      act(() => {
        result.current.getATWithAuthCode("state", "code", "codeVerifier")
      })

      expect(result.current.isLoading).toBeTruthy()
      expect(result.current.error).toBeNull()

      await vi.waitFor(() => {
        expect(result.current.tokens).toEqual({
          accessToken: null,
          refreshToken: null
        })
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.error).toBe("Bad Request")
        expect(deleteStateCookie).toHaveBeenCalled()
      })
    })
  })
  describe("refresh token", () => {
    test("returns access tokens", async () => {
      const mockResponse = {
        access_token: 'access_token_jwt',
        refresh_token: 'refresh_token_jwt',
        expires_at: 1234567890
      }
      // FIXME unstable module mocking was replaced by fetch mock
      vi.stubGlobal('fetch', () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockResponse)
      }))

      const { result } = renderHook(() => useGetAccessToken())

      act(() => {
        result.current.getATWithAuthCode("state", "code", "codeVerifier")
      })
      expect(result.current.isLoading).toBeTruthy()
      expect(result.current.error).toBeFalsy()

      await vi.waitFor(() => {
        expect(result.current.tokens).toEqual({
          accessToken: "access_token_jwt",
          refreshToken: "refresh_token_jwt"
        })
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.error).toBeFalsy()
      })
    })

    test("captures error and delete refresh token", async () => {
      // FIXME unstable module mocking was replaced by fetch mock
      vi.stubGlobal('fetch', () => Promise.resolve({
        ok: false,
        status: 400,
        statusText: 'Bad Request'
      }))
      vi.mock('@/utils/refreshToken', () => ({
        deleteRefreshToken: vi.fn()
      }))

      const { result } = renderHook(() => useGetAccessToken())

      act(() => {
        result.current.getATWithRefreshToken("mock_refresh_token")
      })

      expect(result.current.isLoading).toBeTruthy()
      expect(result.current.error).toBeNull()

      await vi.waitFor(() => {
        expect(result.current.tokens).toEqual({
          accessToken: null,
          refreshToken: null
        })
        expect(result.current.isLoading).toBeFalsy()
        expect(result.current.error).toBe("Bad Request")
        expect(deleteRefreshToken).toHaveBeenCalled()
      })
    })
  })
})
