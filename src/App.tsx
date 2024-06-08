import { useEffect, useState } from 'react'

import { getPKCEState } from '@/utils/auth'
import LoginButton from '@/components/LoginButton'
import { clearAllCookies } from './lib/cookie'

function App() {
  const [isAuthReady, setIsAuthReady] = useState(false)
  const [status, setStatus] = useState('')
  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const state = params.get('state')
    const code = params.get('code')

    const { isReady: isAuthReady, codeVerifier } =
      getPKCEState(state ?? undefined, code ?? undefined)

    setIsAuthReady(isAuthReady)
    if (!isAuthReady) return () => clearAllCookies()
    else setStatus(`code: ${code}, codeVerifier: ${codeVerifier}`)

    return () => clearAllCookies()
  }, [])

  return (
    <>
      {isAuthReady && <p>Ready for Auth Request</p>}
      {status && <p>{status}</p>}
      <LoginButton />
    </>
  )
}

export default App
