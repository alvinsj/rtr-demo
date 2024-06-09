import { z } from "zod"

export type PKCEStatus = {
  isDone: boolean,
  codeVerifier?: string,
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
