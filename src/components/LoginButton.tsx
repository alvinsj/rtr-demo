import { useCallback, useState } from 'react'
import { getPKCECodes, redirectAuthRequestE } from '@/utils/auth'

const LoginButton = () => {
  const [error, setError] = useState('')

  const handleLogin = useCallback(async () => {
    try {
      const codes = await getPKCECodes()
      redirectAuthRequestE(codes.state, codes.codeChallenge)
    } catch (error) {
      if (error instanceof Error)
        setError(error.message)
      else setError('An unknown error occurred')
    }
  }, [])

  return (
    <>
      <button type="submit" onClick={handleLogin}>
        Login
      </button>
      <pre>
        {error}
      </pre>
      <pre>
        {document.cookie}
      </pre>
    </>
  )
}

export default LoginButton
