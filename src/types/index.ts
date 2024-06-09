import { z } from "zod"

export type PKCEStatus = {
  isDone: boolean,
  codeVerifier: string | null,
}

export type AuthTokens = {
  accessToken: string | null,
  refreshToken: string | null
}

export const PostTokenSchema = z.object({
  access_token: z.string(),
  expires_at: z.number(),
  refresh_token: z.string(),
})

export type PostTokenResponse = z.infer<typeof PostTokenSchema>

export enum AuthStage {
  LOGGED_OUT = 'Logged Out',
  BEFORE_REFRESH_TOKEN = 'Before getting token with Refresh Token',
  BEFORE_AUTH_CODE = 'Before getting token with Auth Code',
  AFTER_AUTH_CODE = 'Logged in with Auth Code',
  LOGGED_IN = 'Logged In'
}
