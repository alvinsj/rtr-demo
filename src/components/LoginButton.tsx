import { useCallback, useEffect, useState } from 'react'
import { useContextSelector } from 'use-context-selector'

import useInitPKCE from '@/hooks/useInitPKCE'
import AuthContext from '@/contexts/AuthContext'
import { deleteRefreshToken } from '@/utils/refreshToken'

type LoginButtonProps = {
  className?: string
}
const LoginButton = ({ className }: LoginButtonProps) => {
  const accessToken = useContextSelector(
    AuthContext, ctx => ctx.accessToken
  )
  const setAccessToken = useContextSelector(
    AuthContext, ctx => ctx.setAccessToken
  )
  const [isLoading, setIsLoading] = useState(false)

  const { error, onLogin } = useInitPKCE()
  const handleLogout = useCallback(() => {
    deleteRefreshToken()
    setAccessToken(null)
  }, [setAccessToken])

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true)
    window.addEventListener('beforeunload', handleRouteChangeStart)
    return () => window.removeEventListener('beforeunload', handleRouteChangeStart)
  }, [])

  const isLoggedIn = !!accessToken
  const buttonText = isLoggedIn ? 'Logout' : 'Login'
  const handleButtonClick = isLoggedIn ? handleLogout : onLogin

  return (
    <div className={className}>
      <span className='error'>{error}</span>
      <button type="submit"
        onClick={handleButtonClick}
        disabled={isLoading}>
        {isLoading ? 'Loading...' : buttonText}
      </button>
    </div>
  )
}

export default LoginButton
