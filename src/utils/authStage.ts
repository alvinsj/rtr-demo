import { AuthStage } from '@/types'

type GetAuthStageProps = {
  state: string | null,
  code: string | null,
  accessToken: string | null,
  refreshToken: string | null,
  codeVerifier: string | null
}

type AuthStageResult =
  | { stage: AuthStage.LOGGED_IN; accessToken: string }
  | { stage: AuthStage.BEFORE_REFRESH_TOKEN; refreshToken: string }
  | { stage: AuthStage.BEFORE_AUTH_CODE; state: string; code: string; codeVerifier: string }
  | { stage: AuthStage.AFTER_AUTH_CODE; state: string; }
  | { stage: AuthStage.LOGGED_OUT };

export const getAuthStage = ({
  state, code, codeVerifier,
  accessToken, refreshToken,
}: GetAuthStageProps): AuthStageResult => {

  if (state && code && codeVerifier && accessToken)
    return { stage: AuthStage.AFTER_AUTH_CODE, state }
  if (accessToken)
    return { stage: AuthStage.LOGGED_IN, accessToken }
  if (!accessToken && refreshToken)
    return { stage: AuthStage.BEFORE_REFRESH_TOKEN, refreshToken }
  if (state && code && codeVerifier && !accessToken && !refreshToken)
    return { stage: AuthStage.BEFORE_AUTH_CODE, state, code, codeVerifier }

  console.log('getAuthStage', state, code, codeVerifier,
    accessToken, refreshToken,)
  return { stage: AuthStage.LOGGED_OUT }
}
