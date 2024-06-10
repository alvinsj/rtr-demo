import { useEffect } from 'react'

import AuthContext from '@/contexts/AuthContext'
import { getPKCEStatus } from '@/utils/auth'
import { getAuthStage } from '@/utils/authStage'
import { clearSearchParams, getSearchParams } from '@/utils/route'
import { deleteStateCookie } from '@/utils/stateCookie'
import { AuthStage } from '@/types'

import LoginButton from '@/components/LoginButton'

import useAuthContextValue from '@/hooks/useAuthContextValue'
import useGetAccessToken from '@/hooks/useGetAccessToken'

import s from './App.module.css'

function App() {
  const { state, code } = getSearchParams()
  const { codeVerifier } = getPKCEStatus(state)
  const {
    isLoading, error, tokens,
    getATWithAuthCode, getATWithRefreshToken
  } = useGetAccessToken()
  const authContext = useAuthContextValue(tokens)

  const authStage = getAuthStage({
    state, code, codeVerifier,
    accessToken: authContext.accessToken,
    refreshToken: authContext.refreshToken,
  })

  useEffect(() => {
    if (authStage.stage === AuthStage.AFTER_AUTH_CODE) {
      deleteStateCookie(authStage.state)
      clearSearchParams()
    } else if (authStage.stage === AuthStage.BEFORE_REFRESH_TOKEN) {
      getATWithRefreshToken(authStage.refreshToken)
    } else if (authStage.stage === AuthStage.BEFORE_AUTH_CODE) {
      getATWithAuthCode(authStage.state, authStage.code, authStage.codeVerifier)
    }
    // on stage change only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStage.stage])

  const statuses = {
    accessToken: authContext.accessToken,
    refreshToken: authContext.refreshToken,
    state,
    code,
    codeVerifier,
    cookie: document.cookie || null,
    localStorage: JSON.stringify(localStorage, null, 2)
  }

  return (
    <AuthContext.Provider value={authContext}>
      <main className={s['app']}>
        <LoginButton className={s['app-loginBtn']} />
        <h1>{authStage.stage}</h1>
        {error && <div className="error">{error}</div>}
        {!isLoading && (
          <table className={s['debug-table']}>
            <tbody>
              {Object.entries(statuses).map(([key, value]) => (
                <tr key={key}>
                  <td className={s['debug-itemName']}>{key}</td>
                  <td className={s['debug-itemValue']}>{`${value ?? "<empty>"}`}</td>
                </tr>
              ))}
            </tbody>
          </table>)}
        {isLoading && <p>Loading...</p>}
      </main>
    </AuthContext.Provider>
  )
}

export default App
