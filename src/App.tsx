import { useEffect } from 'react'

import { getPKCEStatus } from '@/utils/auth'
import { deleteStateCookie } from '@/utils/stateCookie'
import AuthContext from '@/contexts/AuthContext'

import LoginButton from '@/components/LoginButton'

import useAuthContextValue from '@/hooks/useAuthContextValue'
import useGetAccessTokenEffect from '@/hooks/useGetAccessTokenEffect'

import s from './App.module.css'

function App() {
  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  const code = params.get('code')

  const { codeVerifier } = getPKCEStatus(state)
  const { isLoading, error, tokens } = useGetAccessTokenEffect(
    state, code, codeVerifier
  )
  const authContext = useAuthContextValue(tokens)

  useEffect(() => {
    if (state && codeVerifier && tokens?.accessToken && tokens?.refreshToken) {
      deleteStateCookie(state)
      window.history.replaceState({}, document.title, '/')
    }
  }, [tokens, codeVerifier, state])

  const status = state && code && codeVerifier ? [
    `state: ${state}`,
    `code: ${code}`,
    `codeVerifier: ${codeVerifier}`
  ] : []

  return (
    <AuthContext.Provider value={authContext}>
      <main className={s['app']}>
        <LoginButton className={s['app-loginBtn']} />
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
