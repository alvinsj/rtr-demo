import { useEffect, useMemo, useState } from 'react'

import { clearAllCookies } from '@lib/cookie'

import { getPKCEStatus } from '@/utils/auth'
import LoginButton from '@/components/LoginButton'
import AuthContext from '@/contexts/AuthContext'
import { postTokens } from '@/apis/postToken'
import { setRefreshToken, getRefreshToken } from '@/utils/token'

import s from './App.module.css'
import { deleteStateCookie } from './utils/stateCookie'

function App() {
  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  const code = params.get('code')

  const [accessToken, setAccessToken] = useState<string | null>(null)
  const [isPKCEDone, setIsPKCEDone] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (state) {
      const { isDone, codeVerifier } = getPKCEStatus(state)

      if (isDone && code) {
        setIsPKCEDone(isDone)
        setStatus(`state: ${state};code: ${code};\
          codeVerifier: ${codeVerifier}`)
        postTokens(code, codeVerifier!)
          .then(res => {
            const { access_token, refresh_token } = res
            setAccessToken(access_token)
            setRefreshToken(refresh_token)
          })
          .catch(err => {
            setStatus(`Error: ${err?.message ?? 'App - An unknown error occurred'}`)
          })
          .finally(() => {
            deleteStateCookie(state)
            window.history.replaceState({}, document.title, '/')
          })
      }
    }

    // on mount only
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const authContext = useMemo(() => {
    return {
      get accessToken(): string | null {
        return accessToken ?? null
      },
      set accessToken(token: string) {
        setAccessToken(token)
      },
      get refreshToken(): string | null {
        return getRefreshToken()
      },
      set refresh_token(token: string) {
        setRefreshToken(token)
      }
    }
  }, [accessToken])

  return (
    <AuthContext.Provider value={authContext}>
      <main className={s['app']}>
        <LoginButton className={s['app-loginBtn']} />
        <pre>
          {isPKCEDone && <>
            PKCE is done
            <table>
              <tr>
                <td className='debug-itemName'>accessToken</td>
                <td className="debug-longText">{`${accessToken}`}</td>
              </tr>
              <tr>
                <td className='debug-itemName'>refreshToken</td>
                <td className="debug-longText">{`${getRefreshToken()}`}</td>
              </tr>
            </table>
          </>
          }
          {status && status.split(';').map(s => <div>{s}</div>)}
        </pre>
      </main>
    </AuthContext.Provider>
  )
}

export default App
