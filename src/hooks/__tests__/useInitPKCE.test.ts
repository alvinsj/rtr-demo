import { beforeAll, expect, describe, test, vi, afterAll } from 'vitest'
import { renderHook } from '@testing-library/react'

import useInitPKCE from '../useInitPKCE'
import config from '@/config'

describe('useInitPKCE', () => {
  const redirect = vi.fn()
  beforeAll(() => {
    vi.stubGlobal('location', { replace: redirect })
  })

  afterAll(() => {
    vi.unstubAllGlobals()
  })

  test('returns empty error and onLogin', () => {
    const { result } = renderHook(() => useInitPKCE())
    expect(result.current).toMatchObject({
      error: '',
      onLogin: expect.any(Function),
    })
  })

  test('redirects to login url', async () => {
    const { result } = renderHook(() => useInitPKCE())
    await result.current.onLogin()

    expect(redirect).toHaveBeenCalled()
    const url = redirect.mock.calls[0][0]
    const query = new URLSearchParams(url.split('?')[1])

    expect(query.get('response_type')).toBe('code,id_token')
    expect(query.get('redirect_uri')).toBe(config.BASE_URL)
    expect(query.get('state')).toEqual(expect.any(String))
    expect(query.get('code_challenge')).toEqual(expect.any(String))
  })
})

