import { describe, test, expect, beforeAll, afterAll, vi, afterEach } from 'vitest'
import { saveCookie, getCookie, deleteCookie, clearAllCookies } from '../cookie'

describe('cookie', () => {
  let mockCookie: string[] = []
  beforeAll(() => {
    vi.stubGlobal('document', {
      get cookie() {
        return mockCookie.join(';')
      },
      set cookie(value) {
        mockCookie = mockCookie.filter(c => !c.startsWith(value.split('=')[0]))
        mockCookie.push(value)
      },
    })
  })

  afterEach(() => {
    mockCookie = []
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  describe('saveCookie', () => {
    test('saves empty value', () => {
      saveCookie('a', '')
      expect(document.cookie).toMatch('a=;')
    })

    test('saves cookie', () => {
      saveCookie('a', '1234')
      expect(document.cookie).toMatch('a=1234;')
    })

    test('saves cookie with latest value', () => {
      saveCookie('a', '1234')
      saveCookie('a', '124')
      expect(document.cookie).toMatch('a=124;')
      expect(document.cookie).not.toMatch('a=1234;')
    })
  })

  describe('getCookie', () => {
    test('gets none', () => {
      saveCookie('b', '54321')
      expect(getCookie('c')).toBeUndefined()
    })

    test('gets cookie', () => {
      saveCookie('b', '54321')
      expect(getCookie('b')).toBe('54321')
    })
  })

  describe('deleteCookie', () => {
    test('deletes cookie', () => {
      saveCookie('a', '12345')
      expect(document.cookie).toMatch('a=12345;')

      deleteCookie('a')
      expect(document.cookie).toMatch('a=;')
    })

    test('deletes cookie without affecting others', () => {
      saveCookie('a', '12345')
      expect(document.cookie).toMatch('a=12345;')

      saveCookie('b', '54321')
      expect(document.cookie).toMatch('b=54321;')

      deleteCookie('a')
      expect(document.cookie).toMatch('a=;')
      expect(document.cookie).toMatch('b=54321;')
    })

    test('deletes none', () => {
      saveCookie('a', '12345')
      saveCookie('b', '54321')
      deleteCookie('c')
      expect(document.cookie).toMatch('a=12345;')
      expect(document.cookie).toMatch('b=54321;')
    })
  })

  describe('clearAllCookies', () => {
    test('clears all cookies', () => {
      saveCookie('a', '12345')
      saveCookie('b', '54321')
      clearAllCookies()
      expect(document.cookie).toMatch('a=;')
      expect(document.cookie).toMatch('b=;')
    })
  })
})
