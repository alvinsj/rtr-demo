import { useEffect, useState } from 'react'

import useInitPKCE from '@/hooks/useInitPKCE'

type LoginButtonProps = {
  className?: string
}
const LoginButton = ({ className }: LoginButtonProps) => {
  const { error, onLogin } = useInitPKCE()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true)
    window.addEventListener('beforeunload', handleRouteChangeStart)
    return () => window.removeEventListener('beforeunload', handleRouteChangeStart)
  }, [])

  return (
    <div className={className}>
      <span className='error'>{error}</span>
      <button type="submit" onClick={onLogin} disabled={isLoading}>
        {isLoading ? 'Loading...' : 'Login'}
      </button>
    </div>
  )
}

export default LoginButton
