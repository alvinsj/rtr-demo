import { useEffect, useState } from 'react'

import { getPKCEStatus } from '@/utils/auth'
import LoginButton from '@/components/LoginButton'
import { clearAllCookies } from '@lib/cookie'

function App() {
  const params = new URLSearchParams(window.location.search)
  const state = params.get('state')
  const code = params.get('code')

  const [isAuthReady, setIsAuthReady] = useState(false)
  const [status, setStatus] = useState('')

  useEffect(() => {
    if (state) {
      const { isDone: isAuthReady, codeVerifier } =
        getPKCEStatus(state)

      if (isAuthReady) {
        setIsAuthReady(isAuthReady)
        setStatus(`code: ${code}, codeVerifier: ${codeVerifier}`)
      }
    }

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
