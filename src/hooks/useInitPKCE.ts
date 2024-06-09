import { useCallback, useState } from 'react'
import { createPKCECodes, redirectToLogin } from '@/utils/auth'

const useInitPKCE = () => {
  const [error, setError] = useState('')

  const onLogin = useCallback(async () => {
    try {
      const codes = await createPKCECodes()
      redirectToLogin(codes.state, codes.codeChallenge)
    } catch (error) {
      if (error instanceof Error)
        setError(error.message)
      else setError('initPKCE - An unknown error occurred')
    }
  }, [])

  return { error, onLogin }
}

export default useInitPKCE
