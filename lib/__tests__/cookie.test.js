import { describe, test, expect, beforeEach } from "vitest"
import { saveCookie, getCookie, deleteCookie } from "../cookie"

describe("saveCookie", () => {
  test("throws error on empty name", () => {
    expect(() => saveCookie())
      .toThrowError("Cookie name is required")
  })

  test("saves empty value", () => {
    saveCookie("a", "")
    expect(document.cookie).toMatch("a=")
  })

  test("saves cookie", () => {
    saveCookie("a", "1234")
    expect(document.cookie).toMatch("a=1234")
  })

  test("saves cookie with latest value", () => {
    saveCookie("a", "1234")
    saveCookie("a", "124")
    expect(document.cookie).toMatch("a=124")
    expect(document.cookie).not.toMatch("a=1234")
  })
})

describe("getCookie", () => {
  test("gets none", () => {
    saveCookie("b", "54321")
    expect(getCookie("c")).toBeUndefined()
  })

  test("gets cookie", () => {
    saveCookie("b", "54321")
    expect(getCookie("b")).toBe("54321")
  })
})

describe("deleteCookie", () => {
  test("deletes cookie", () => {
    saveCookie("c", "12345")
    saveCookie("d", "54321")
    deleteCookie("c")
    expect(document.cookie).not.toMatch("c=12345")
    expect(document.cookie).toMatch("d=54321")
  })

  test("deletes none", () => {
    saveCookie("one", "12345")
    saveCookie("two", "54321")
    deleteCookie("e")
    expect(document.cookie).toMatch("one=12345")
    expect(document.cookie).toMatch("two=54321")
  })
})
