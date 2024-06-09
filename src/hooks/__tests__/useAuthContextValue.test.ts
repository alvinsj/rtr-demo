import { describe, test, expect, vi } from "vitest"
import { renderHook } from "@testing-library/react"

import useAuthContextValue from "@/hooks/useAuthContextValue"

describe("useAuthContextValue", () => {
  test("returns auth context", () => {
    const { result } = renderHook(() => useAuthContextValue({}))
    expect(result.current).toEqual({
      accessToken: null,
      refreshToken: null,
      setAccessToken: expect.any(Function),
      setRefreshToken: expect.any(Function)
    })
  })

  test("updates access token and refresh token", async () => {
    const { result } = renderHook(() => useAuthContextValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken"
    }))

    vi.waitFor(() => {
      expect(result.current.accessToken).toBe("accessToken")
      expect(result.current.refreshToken).toBe("refreshToken")
    })
  })
})





