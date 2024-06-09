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
  LOGGED_OUT = 'LOGGED_OUT',
  BEFORE_REFRESH_TOKEN = 'BEFORE_REFRESH_TOKEN',
  BEFORE_AUTH_CODE = 'BEFORE_AUTH_CODE',
  AFTER_AUTH_CODE = 'AFTER_AUTH_CODE',
  LOGGED_IN = 'LOGGED_IN'
}
