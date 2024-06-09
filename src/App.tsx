import { useEffect } from 'react'

import { getPKCEStatus } from '@/utils/auth'
import { deleteStateCookie } from '@/utils/stateCookie'
import AuthContext from '@/contexts/AuthContext'

import LoginButton from '@/components/LoginButton'

import useAuthContextValue from '@/hooks/useAuthContextValue'
import useGetAccessToken from '@/hooks/useGetAccessToken'

import s from './App.module.css'
import LogoutButton from './components/LogoutButton'

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

  useEffect(() => {
    if (authContext.refreshToken && !authContext.accessToken) {
      getATWithRefreshToken(authContext.refreshToken)
    } else if (code && codeVerifier) {
      getATWithAuthCode(code, codeVerifier)
    }
    // once on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const justDoneAuthCodeRequest =
    state && codeVerifier && tokens?.accessToken && tokens?.refreshToken
  useEffect(() => {
    if (justDoneAuthCodeRequest) {
      deleteStateCookie(state)
      window.history.replaceState({}, document.title, '/')
    }
  }, [justDoneAuthCodeRequest, state])

  const status = state && code && codeVerifier ? [
    `state: ${state}`,
    `code: ${code}`,
    `codeVerifier: ${codeVerifier}`
  ] : []

  const isLoggedIn = !!authContext.accessToken

  return (
    <AuthContext.Provider value={authContext}>
      <main className={s['app']}>
        {isLoggedIn
          ? <LogoutButton className={s['app-loginBtn']} />
          : <LoginButton className={s['app-loginBtn']} />
        }
        <pre>
          {!isLoading && <>
            <table>
              <tbody>
                <tr>
                  <td className='debug-itemName'>accessToken</td>
                  <td className="debug-longText">{`${authContext.accessToken}`}</td>
                </tr>
                <tr>
                  <td className='debug-itemName'>refreshToken</td>
                  <td className="debug-longText">{`${authContext.refreshToken}`}</td>
                </tr>
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
