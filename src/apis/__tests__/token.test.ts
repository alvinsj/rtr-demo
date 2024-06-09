import { describe, test, expect, vi } from 'vitest'
import { postTokens } from '../token'
import { ZodError } from 'zod'

describe('postTokens', () => {
  test('returns access and refresh tokens', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'access_token_from_server',
        refresh_token: 'refresh_token_from_server',
        expires_at: 1234567890
      })
    }))

    const res = await postTokens('code', 'codeVerifier')
    expect(res).toEqual({
      access_token: 'access_token_from_server',
      refresh_token: 'refresh_token_from_server',
      expires_at: 1234567890
    })
  })

  test('throws error on invalid response schema', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        renamed_access_token: 'access_token_from_server',
        refresh_token: 'refresh_token_from_server',
        expires_at: 1234567890
      })
    }))

    try {
      await postTokens('code', 'codeVerifier')
    } catch (error) {
      const zodError = [{
        "code": "invalid_type", "expected": "string", "received": "undefined",
        "path": ["access_token"], "message": "Required"
      }]
      expect(error).toBeInstanceOf(ZodError)
      expect((error as ZodError).message.replace(/\s+/g, ''))
        .toEqual(JSON.stringify(zodError))
    }
  })


  test('throws error on http error response', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: false,
      status: 400,
      statusText: 'Bad Request'
    }))

    try {
      await postTokens('code', 'codeVerifier')
    } catch (error) {
      expect(error).toEqual(new Error('Bad Request'))
    }
  })
})
