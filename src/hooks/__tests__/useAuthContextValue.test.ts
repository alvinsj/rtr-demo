import { describe, test, expect } from "vitest"
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

  test("updates access token and refresh token", () => {
    const { result } = renderHook(() => useAuthContextValue({
      accessToken: "accessToken",
      refreshToken: "refreshToken"
    }))

    expect(result.current.accessToken).toBe("accessToken")
    expect(result.current.refreshToken).toBe("refreshToken")
  })
})





