import { useEffect } from 'react'

import AuthContext from '@/contexts/AuthContext'
import { getPKCEStatus } from '@/utils/auth'
import { deleteStateCookie } from '@/utils/stateCookie'
import { AuthStage } from '@/types'

import LoginButton from '@/components/LoginButton'

import useAuthContextValue from '@/hooks/useAuthContextValue'
import useGetAccessToken from '@/hooks/useGetAccessToken'

import s from './App.module.css'
import LogoutButton from './components/LogoutButton'
import { getAuthStage } from './utils/authStage'

function clearSearchParams() {
  const url = new URL(window.location.href) // Create a URL object from the current window location
  url.search = '' // Clear the search parameters
  window.history.replaceState({}, document.title, url.toString()) // Update the URL without reloading the page
}

function App() {
  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  const code = params.get('code')
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
    // once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [authStage.stage])

  const statuses = {
    accessToken: authContext.accessToken,
    refreshToken: authContext.refreshToken,
    state,
    code,
    codeVerifier,
  }

  return (
    <AuthContext.Provider value={authContext}>
      <main className={s['app']}>
        {authStage.stage === AuthStage.LOGGED_IN
          ? <LogoutButton className={s['app-loginBtn']} />
          : <LoginButton className={s['app-loginBtn']} />
        }
        <h1>Stage: {authStage.stage}</h1>
        <pre>
          {!isLoading && <>
            <table>
              <tbody>
                {Object.entries(statuses).filter(([, v]) => !!v).map(([key, value]) => (
                  <tr key={key}>
                    <td className='debug-itemName'>{key}</td>
                    <td className="debug-longText">{`${value}`}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
          }
          {status && status.map(s => <div key={s}>{s}</div>)}
          {error && <div className='debug-error'>{error}</div>}
        </pre>
      </main>
    </AuthContext.Provider>
  )
}

export default App
