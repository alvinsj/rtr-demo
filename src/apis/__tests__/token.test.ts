import { describe, test, expect, vi, afterEach } from 'vitest'
import { postToken, postTokenWithAuthCode, postTokenWithRefreshToken } from '../token'
import { ZodError } from 'zod'

describe('postToken', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
  })

  test('returns access and refresh tokens', async () => {
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve({
        access_token: 'access_token_from_server',
        refresh_token: 'refresh_token_from_server',
        expires_at: 1234567890
      })
    }))

    const res = await postToken('')
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
      await postToken('')
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
      await postToken('')
    } catch (error) {
      expect(error).toEqual(new Error('Bad Request'))
    }
  })

  test('postTokenWithAuthCode', async () => {
    const mockResponse = {
      access_token: 'access_token_from_server',
      refresh_token: 'refresh_token_from_server',
      expires_at: 1234567890
    }
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }))
    const res = await postTokenWithAuthCode("code", "code_verifier")

    expect(res).toEqual(mockResponse)
  })

  test('postTokenWithRefreshToken', async () => {
    const mockResponse = {
      access_token: 'access_token_from_server',
      refresh_token: 'refresh_token_from_server',
      expires_at: 1234567890
    }
    vi.stubGlobal('fetch', () => Promise.resolve({
      ok: true,
      json: () => Promise.resolve(mockResponse)
    }))
    const res = await postTokenWithRefreshToken("refresh_token_jwt")

    expect(res).toEqual(mockResponse)
  })
})
