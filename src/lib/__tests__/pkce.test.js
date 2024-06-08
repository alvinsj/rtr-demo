import { describe, expect, test } from 'vitest'
import {
  toSha256,
  toBase64Url,
  createRandomString,
  createPKCECodeChallenge,
} from '../pkce'

describe('createRandomString', () => {
  test('throws error on 0 length', () => {
    expect(() => createRandomString(0))
      .toThrow('length must be greater than 0')
  })

  test('creates string with length', () => {
    const randomString43 = createRandomString(43)
    const randomString128 = createRandomString(128)

    expect(randomString43).toHaveLength(43)
    expect(randomString128).toHaveLength(128)
  })

  test('creates unique strings', () => {
    const randomString1 = createRandomString(43)
    const randomString2 = createRandomString(43)

    expect(randomString1).not.toEqual(randomString2)
    console.log(randomString1)
  })
})

describe('toSha256', () => {
  test('throws error on empty string', async () => {
    await expect(toSha256('')).rejects.toThrow('data is required')
  })

  test('hashes correctly', async () => {
    const hash = await toSha256('hello')
    const base64url = toBase64Url(hash)

    // LPJNul+wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ=
    // but without + and =
    expect(base64url).toEqual('LPJNul-wow4m6DsqxbninhsWHlwfp0JecwQzYpOLmCQ')
  })
})

describe('toBase64Url', () => {
  test('converts to base64url', () => {
    const base64url = toBase64Url([1, 2, 3, 4, 5])

    expect(base64url).toEqual('AQIDBAU')
  })
})

describe('createPKCECodeChallenge', () => {
  test('creates code challenge', async () => {
    const codeVerifier = createRandomString(43)
    const codeChallenge = await createPKCECodeChallenge(codeVerifier)

    expect(codeChallenge).toHaveLength(43)
  })

  test('creates unique code challenge', async () => {
    const codeVerifier = createRandomString(43)
    const codeChallenge1 = await createPKCECodeChallenge(codeVerifier)
    const codeChallenge2 = await createPKCECodeChallenge(codeVerifier)

    expect(codeChallenge1).toEqual(codeChallenge2)
  })
})
