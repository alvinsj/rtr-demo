import { Sha256 } from '@aws-crypto/sha256-js';

export const toSha256 = async (data: string): Promise<Uint8Array> => {
  if (!data) throw new Error('data is required');

  const hash = new Sha256();
  hash.update(data);

  const hashed = await hash.digest();
  return hashed;
}

// refer to base64url-encoding in RFC 7636
// https://datatracker.ietf.org/doc/html/rfc7636#appendix-A
export const toBase64Url = (bytes: Uint8Array) => {
  if (bytes.length === 0) throw new Error('bytes must not be empty');

  const charCodes = Array.from(bytes);
  let str = btoa(String.fromCharCode.apply(null, charCodes));
  str = str.split('=')[0];
  str = str.replace(/\+/g, '-');
  str = str.replace(/\//g, '_');
  return str;
}

// refer to random string generation in RFC 7636
// https://datatracker.ietf.org/doc/html/rfc7636#section-4.1
export const createRandomString = (length: number = 34): string => {
  if (length === 0) throw new Error('length must be greater than 0');

  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let randomString = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    randomString += charset[randomIndex];
  }
  return randomString;
}

export const createPKCECodeChallenge = async (codeVerifier: string): string => {
  const hashed: Uint8Array = await toSha256(codeVerifier)
  const codeChallenge = toBase64Url(hashed)
  return codeChallenge;
}
