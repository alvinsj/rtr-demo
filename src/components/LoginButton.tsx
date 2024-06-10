import { useCallback, useEffect, useState } from 'react'
import { useContextSelector } from 'use-context-selector'

import useInitPKCE from '@/hooks/useInitPKCE'
import AuthContext from '@/contexts/AuthContext'
import { deleteRefreshToken } from '@/utils/refreshToken'
import { reload } from '@/utils/route'

type LoginButtonProps = {
  className?: string
}
const LoginButton = ({ className }: LoginButtonProps) => {
  const accessToken = useContextSelector(AuthContext, ctx => ctx.accessToken)

  const [isLoading, setIsLoading] = useState(false)

  const { error, onLogin } = useInitPKCE()
  const handleLogout = useCallback(() => {
    deleteRefreshToken()
    reload()
  }, [])

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true)
    window.addEventListener('beforeunload', handleRouteChangeStart)
    return () => window.removeEventListener('beforeunload', handleRouteChangeStart)
  }, [])

  const isLoggedIn = !!accessToken

  return (
    <div className={className}>
      <span className='error'>{error}</span>
      <button type="submit"
        onClick={isLoggedIn ? handleLogout : onLogin}
        disabled={isLoading}>
        {isLoading ? 'Loading...' : (isLoggedIn ? 'Logout' : 'Login')}
      </button>
    </div>
  )
}

export default LoginButton
