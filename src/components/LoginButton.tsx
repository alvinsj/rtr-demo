import { useCallback, useState } from 'react'
import { createPKCECodes, redirectToLogin } from '@/utils/auth'

const LoginButton = () => {
  const [error, setError] = useState('')

  const handleLogin = useCallback(async () => {
    try {
      const codes = await createPKCECodes()
      redirectToLogin(codes.state, codes.codeChallenge)
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
