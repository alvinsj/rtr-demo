import { useCallback, useEffect, useState } from "react"

import { reload } from '@/utils/route'
import { deleteRefreshToken } from "@/utils/refreshToken"

type LogoutButtonProps = {
  className?: string
}
const LogoutButton = ({ className }: LogoutButtonProps) => {
  const handleLogout = useCallback(() => {
    deleteRefreshToken()
    reload()
  }, [])

  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    const handleRouteChangeStart = () => setIsLoading(true)
    window.addEventListener('beforeunload', handleRouteChangeStart)
    return () => window.removeEventListener('beforeunload', handleRouteChangeStart)
  }, [])

  return (
    <div className={className}>
      <span>
        <button type="submit" onClick={handleLogout} disabled={isLoading}>
          {isLoading ? 'Loading...' : 'Logout'}
        </button>
      </span>
    </div>
  )
}

export default LogoutButton
