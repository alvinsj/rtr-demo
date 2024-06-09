export type PKCEStatus = {
  isDone: boolean,
  codeVerifier?: string,
}

export type AuthTokens = {
  accessToken: string | null,
  refreshToken: string | null
}
